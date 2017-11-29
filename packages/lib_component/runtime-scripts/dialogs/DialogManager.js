var DialogDescription = require('DialogDescription');
// clazz define
var DialogManager = cc.Class({
    extends: cc.Component,
    editor: {
        disallowMultiple: true,
        menu: "SUGA/Dialog Framework/DialogManager"
    },
    properties: {
        // private field
        // public fields
        builtinContainer: cc.Node,
        overlay: cc.Node,
        loading: cc.Node,
        loadingLabel: cc.Label,
        view: cc.Node,
        descriptions: cc.Node,
        marqueeNode: cc.Node,
        marqueeLabel: cc.RichText,
        marqueeScrollingX: -2,
        // [{id: <key>,time: 1, message: 'Hello from the other side.'}]
        _marqueeMessageQueue: {
            visible: false,
            default: []
        },
    },
    statics: {
        getInstance: function() {
            return DialogManager._instance;
        },
        _validateInstance: function() {
            return (!!DialogManager._instance && DialogManager._instance instanceof DialogManager);
        },
        showDialog: function(dialogName, params, actions) {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.showDialog.call(_instance, dialogName, params || {}, actions);
            } else {}
        },
        hideDialog: function(dialogName, params, actions) {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.hideDialog.call(_instance, dialogName, params || {}, actions);
            } else {}
        },
        showLoading: function(loadingText, showOverlay) {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.showLoading.call(_instance, loadingText, showOverlay);
            }
        },
        hideLoading: function() {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.hideLoading.call(_instance);
            }
        },
        showOverlay: function() {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.showOverlay.call(_instance);
            }
        },
        hideOverlay: function() {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.hideOverlay.call(_instance);
            }
        },
        addMarqueeMessage: function(key, count, message) {
            if (DialogManager._validateInstance()) {
                var _instance = DialogManager.getInstance();
                _instance.addMarqueeMessage.call(_instance, key, count, message);
            }
        }
    },
    ctor: function() {
        if (DialogManager._validateInstance()) {
            if (!CC_EDITOR) {
                cc.error("DialogManager was initialized!");
            }
            return;
        }
        DialogManager._instance = this;
    },
    onLoad: function() {
        if (!!this.builtinContainer) {
            this.builtinContainer.active = false;
        }
        if (!DialogManager._validateInstance() || this !== DialogManager._instance) {
            return;
        }
        DialogManager._instance = this;
        this._loadDialogMeta();
        this.hideLoading();
        this.hideOverlay();
        if (!!this.loadingLabel) this.loadingLabel.string = '';
        this._marqueeMessageQueue = [];
    },
    onDestroy: function() {
        if (DialogManager._validateInstance() && this === DialogManager._instance) {
            DialogManager._instance = null;
        }
    },
    _loadDialogMeta: function() {
        var descriptions = this.descriptions.getComponentsInChildren(DialogDescription) || [];
        var cachedDescription = this._cachedDescription || {};
        for (var i = 0; i < descriptions.length; i++) {
            var descriptionComponent = descriptions[i];
            var dialogName = descriptionComponent.node.name;
            if (!!cachedDescription[dialogName]) {
                cc.error('There already defined dialog %s', dialogName);
                continue;
            }
            // set manager
            // descriptionComponent.manager = this;
            cachedDescription[dialogName] = descriptionComponent;
        }
        this._cachedDescription = cachedDescription;
    },
    showLoading: function(loadingText, showOverlay) {
        // mean this var is not setted and leave as undefined
        if (showOverlay !== true && showOverlay !== false) {
            showOverlay = true;
        }
        if (!!this.loading) {
            this.loading.active = true;
        }
        if (!!this.loadingLabel) {
            this.loadingLabel.node.active = !!loadingText;
            this.loadingLabel.string = loadingText;
        }
        if (!!showOverlay) {
            var dialogViewChildrenCount = 0;
            if (!!this.view) dialogViewChildrenCount = this.view.children.length;
            this.showOverlay(Math.max(0, dialogViewChildrenCount));
        }
    },
    hideLoading: function() {
        if (!!this.loading) {
            this.loading.active = false;
            this.hideOverlay();
        }
    },
    showOverlay: function(zIndex) {
        if (!!this.overlay) {
            this.overlay.setSiblingIndex(zIndex || this.overlay.getSiblingIndex());
            this.overlay.active = true;
        }
    },
    hideOverlay: function() {
        var overlay = this.overlay;
        if (!overlay) {
            return;
        }
        var shouldHide = true;
        var childDialog = this.view.children;
        for (var i = childDialog.length - 1; i >= 0; i--) {
            var child = childDialog[i];
            var dialogName = child.name;
            if (!child.active) {
                continue;
            }
            var dlgScripts = child.getComponent(require('SGDialog'));
            if (!dlgScripts) {
                continue;
            }
            var dialogDescription = this._cachedDescription[dialogName];
            if (dialogDescription.showOverlay === true && shouldHide) {
                shouldHide = false;
                var newIndex = Math.max(0, child.zIndex - 1);
                overlay.setSiblingIndex(newIndex);
                child.setSiblingIndex(newIndex + 1);
                break;
            }
            if (!shouldHide) {
                break;
            }
        }
        overlay.active = !shouldHide;
    },
    showDialog: function(dialogName, params, actions) {
        var self = this;
        params = params || {};
        var dialogDescription = self._cachedDescription[dialogName];
        if (!dialogDescription) {
            cc.error('DialogManager: unknown dialog %s', dialogName);
            return;
        }
        cc.log('DialogManager:showDialog %s - %s', dialogName, params);
        // manager
        var dialogView = self.view;
        // description
        var startPosition = dialogDescription.startPosition || new cc.v2(0, 0);
        var startScale = dialogDescription.startScale || new cc.v2(1, 1);
        var showOverlay = dialogDescription.showOverlay || false;
        var multipleInstance = dialogDescription.multipleInstance || false;
        var autoResetToBeginning = dialogDescription.autoResetToBeginning;
        var prefab = dialogDescription.prefab || dialogDescription.nodeToClone;
        var showAnimation = dialogDescription.showAnimation;
        var hideAnimation = dialogDescription.hideAnimation;
        // load from cache
        var dialogNode = dialogView.getChildByName(dialogName);
        var isOldDialogFromCache = !!dialogNode;
        var dialog = null;
        if (!prefab || !(prefab && (prefab instanceof cc.Prefab || prefab instanceof cc.Node))) {
            cc.error('Unknown Dialog ' + dialogName);
            return;
        }
        // is it accepted multiple instance?
        // check it existed?
        if (!dialogNode || multipleInstance === true) {
            // do create from prefab if current instance not exist
            dialogNode = cc.instantiate(prefab);
            dialogNode.active = false;
            dialogNode.name = dialogName;
            dialogNode.parent = dialogView;
            isOldDialogFromCache = false;
            cc.log('DialogManager: create new instance %s', dialogName);
        }
        if (!dialog && dialogNode && dialogNode instanceof cc.Node) {
            dialog = dialogNode.getComponent(require('SGDialog'));
        }
        if (!!dialog) {
            if (autoResetToBeginning === true) {
                dialogNode.x = startPosition.x;
                dialogNode.y = startPosition.y;
                dialogNode.scaleX = startScale.x;
                dialogNode.scaleY = startScale.y;
            }
            dialog._params = params;
            dialog._showAnimation = (!!showAnimation && (showAnimation instanceof cc.AnimationClip)) ? showAnimation.name : '';
            dialog._hideAnimation = (!!hideAnimation && (hideAnimation instanceof cc.AnimationClip)) ? hideAnimation.name : '';
            var wasShown = dialogNode.active === true;
            dialogNode.active = true;
            dialog.enable = true;
            var animation = dialogNode.getComponent(cc.Animation);
            if (!animation) {
                animation = dialogNode.addComponent(cc.Animation);
            }
            if (!!animation) {
                animation.playOnLoad = false;
                animation.addClip(showAnimation, showAnimation.name);
                animation.addClip(hideAnimation, hideAnimation.name);
            }
            if (!wasShown && !!dialog._showAnimation && !!animation) {
                animation.play(dialog._showAnimation);
            }
            if (!isOldDialogFromCache && dialog.onInit && typeof dialog.onInit === 'function') {
                dialog.onInit(params);
            }
            if (dialog.onShown && typeof dialog.onShown === 'function') {
                dialog.onShown(params);
            }
            var dialogViewChildren = dialogView.children;
            var dialogViewChildrenCount = dialogView.children.length;
            if (showOverlay === true) {
                self.showOverlay(Math.max(0, dialogViewChildrenCount - 1));
            }
            dialogNode.setSiblingIndex(Math.max(0, dialogViewChildrenCount - 1));
        }
    },
    hideDialog: function(dialog, params, actions) {
        var _SGDialog = require('SGDialog');
        var self = this;
        var dialogName = '';
        if (!!dialog && dialog instanceof _SGDialog) {
            dialogName = dialog.node.name;
        } else if (!!dialog && typeof(dialog) === 'string') {
            dialogName = dialog;
            dialog = self.view.getChildByName(dialogName);
            if (!!dialog && !(dialog instanceof _SGDialog)) {
                dialog = dialog.getComponent(_SGDialog);
            }
        } else {
            cc.error('Unknown dialog io %s', dialogName || dialog);
            return;
        }
        // get dialog meta
        var dialogDescription = self._cachedDescription[dialogName];
        if (!dialogDescription) {
            cc.error('Unknown dialog %s', dialogName || dialog);
            return;
        }
        if (!dialog || !(dialog instanceof _SGDialog)) {
            cc.error('Could not found any instance of dialog %s', dialogName);
            return;
        }
        if (dialog.onClose && typeof dialog.onClose === 'function') {
            dialog.onClose(params);
        }
        var showOverlay = dialogDescription.showOverlay;
        // helo helo from the otherside
        var onCloseFinished = function() {
            var go = dialog.node || dialog;
            if (!!go) {
                go.active = false;
            }
            if (showOverlay === true) {
                self.hideOverlay();
            }
            if (dialog.onClosed && typeof dialog.onClosed === 'function') {
                dialog.onClosed(params);
            }
            if (dialogDescription.destroyOnClosed === true) {
                dialog.node.destroy();
            }
        };
        // who let' the dog out...whowhohwo
        var animation = dialog.getComponent(cc.Animation);
        if (!animation) {
            animation = dialog.addComponent(cc.Animation);
        }
        // play anim
        if (!!animation && !!dialog._hideAnimation) {
            animation.playOnLoad = false;
            animation.once('finished', onCloseFinished, this);
            animation.play(dialog._hideAnimation);
        } else {
            onCloseFinished();
        }
    },
    /*
     * key: <int>/<string>
     * count: <int> number of time the message scrolling
     * message: <string> the message to display
     */
    addMarqueeMessage: function(key, count, message) {
        if (!message || (!key && key !== 0)) {
            return;
        }
        var queue = this._marqueeMessageQueue;
        var marqueeData = null;
        for (var i = 0; i < queue.length; i++) {
            var _data = queue[i];
            if (_data.key === key) {
                marqueeData = _data;
                break;
            }
        }
        if (!marqueeData) {
            marqueeData = {
                key: key,
                message: message,
                count: count
            };
            queue.push(marqueeData);
        } else {
            marqueeData.count += count;
            if (marqueeData.message !== message) {
                marqueeData.message = message;
            }
        }
    },
    _marqueeNewText: function(dt) {
        if (!!this._marqueeMessageQueue && this._marqueeMessageQueue.length) {
            var marqueeData = this._marqueeMessageQueue[0];
            var count = marqueeData.count - 1;
            var message = marqueeData.message;
            // safe assign if it doesn't ref
            marqueeData.count = count;
            // console.log(marqueeData);
            // remove object
            if (count <= 0) {
                this._marqueeMessageQueue.shift();
            }
            if (!!this.marqueeNode) {
                if (!!this.marqueeLabel) {
                    var screenSize = cc.director.getWinSize();
                    this.marqueeLabel.string = message;
                    var startX = (screenSize.width / 2) + 50 + this.marqueeLabel.node.width;
                    this.marqueeLabel.node.x = startX;
                }
                if (!this.marqueeNode.active) {
                    this.marqueeNode.active = true;
                }
            }
        } else {
            // hide black overlay background
            if (!!this.marqueeNode) {
                this.marqueeNode.active = false;
            }
        }
    },
    update: function(dt) {
        if (CC_EDITOR) {
            return;
        }
        if (!!this.marqueeNode && !!this.marqueeNode.active) {
            if (!!this.marqueeLabel) {
                var screenSize = cc.director.getWinSize();
                var labelNode = this.marqueeLabel.node;
                labelNode.x += this.marqueeScrollingX * dt;
                var endX = -(screenSize.width / 2 + 50);
                // it will not deactive util the queue empty
                if (labelNode.x < endX) {
                    this._marqueeNewText(dt);
                }
            }
        } else {
            this._marqueeNewText(dt);
        }
    }
});
module.exports = DialogManager;