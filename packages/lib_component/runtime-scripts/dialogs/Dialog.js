var DialogManager = require('DialogManager');
var Dialog = cc.Class({
    extends: cc.Component,
    editor: {
        disallowMultiple: true,
        menu: "Dialog Framework/Dialog"
    },
    properties: {
        _params: null,
        _showAnimation: '',
        _hideAnimation: ''
    },
    // called once after dialog instantiated
    onInit: function(params) {
        // cc.log(this.name, 'onShow');
    },
    onShown: function(params) {
        cc.log(this.name, 'onShow');
    },
    // called before closing progress
    onClose: function(params) {
        // cc.log(this.name, 'onClose');
    },
    // called after closing progress completed
    onClosed: function(params) {
        // cc.log(this.name, 'onClosed');
    },
    close: function(params) {
        DialogManager.hideDialog(this, params);
    }
});
module.exports = Dialog;