var DialogManager = require('DialogManager');
var DialogDescription = cc.Class({
    extends: cc.Component,
    editor: {
        disallowMultiple: true,
        menu: "Dialog Framework/DialogDescription"
    },
    properties: {
        prefab: {
            default: null,
            type: cc.Prefab,
            tooltip: 'Prefab to be instantiate if not set. It use nodeToClone inteads (prefered)'
        },
        nodeToClone: {
            default: null,
            type: cc.Node,
            tooltip: 'Node to be instantiate if not set. It use prefab inteads (alternative)'
        },
        showAnimation: cc.AnimationClip,
        hideAnimation: cc.AnimationClip,
        autoResetToBeginning: true,
        multipleInstance: false,
        showOverlay: false,
        destroyOnClosed: false,
        startPosition: {
            default: new cc.v2(0, 0)
        },
        startScale: {
            default: new cc.v2(1, 1)
        },
        startRotation: 0.0
    }
});
module.exports = DialogDescription;