const UIDialog = require('Dialog');
cc.Class({
    extends: UIDialog,
    properties: {
        _onOkCallback: null,
        _onCancelCallback: null,
        labelTitle: cc.Label,
        labelMessage: cc.Label,
        buttonOk: cc.Button,
        buttonCancel: cc.Button
    },
    // use this for initialization
    onShown: function(data) {
        data = data || {};
        this._onOkCallback = data.onOkCallback || null;
        this._onCancelCallback = data.onCancelCallback || null;
        var okText = data.okText || 'Ok';
        var cancelText = data.cancelText || 'Cancel';
        var showOk = data.showOk || false;
        var showCancel = data.showCancel || false;
        if (!!data.title) {
            this.labelTitle.string = data.title || 'Dialog';
        }
        if (!!this.buttonOk) {
            this.buttonOk.node.active = showOk;
            var text = this.buttonOk.getComponentInChildren(cc.Label);
            if (!!text) {
                text.string = okText;
            }
        }
        if (!!this.buttonCancel) {
            this.buttonCancel.node.active = showCancel;
            var text = this.buttonCancel.getComponentInChildren(cc.Label);
            if (!!text) {
                text.string = cancelText;
            }
        }
        if (!!this.labelMessage) {
            this.labelMessage.string = data.message || '';
        }
    },
    onOkClicked: function() {
        // onOKClicked
        if (this._onOkCallback && typeof this._onOkCallback === 'function') {
            var doClose = this._onOkCallback();
            if (doClose === true) {
                this.close();
            }
        }
    },
    onCancelClicked: function() {
        // onCancelClicked
        if (this._onCancelCallback && typeof this._onCancelCallback === 'function') {
            var doClose = this._onCancelCallback();
            if (doClose === true) {
                this.close();
            }
        }
    }
});