/*
def config infos
 */
window.SG = {};
window.SG.env = 1; // 1:dev, 2: release;
window.SG.isDev = function () {
    return (parseInt(window.SG.env) || 2) === 1;
};
var config = window.SG.config = {
    userId: 'SU19',
    token: '0aa6c82e32d121e1454355afcfb05e7cbfb52a27390d9e23f09f47f7d1a4aa64',
    room: 'LPK_1',
    lang: 'en',
    scene: '',
    tableId: 0,
    roomId: 0,
    avatarHost: 'http://i.avawlpk.com/Avatar/', // http://i.avawlpk.com/Avatar/L/LOLDP7.jpg
    network: {
        host: 't7979.xyz',
        port: 9999,
        zone: ''
    }
};
window.SG.utils = {};
// WEB_PLATFORM
if (cc.sys.isBrowser === true) {
    window.SG.utils.getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
} else {
    window.SG.utils.getParameterByName = function (name) {
        return '';
    }
}
window.SG.utils.decodeBase64 = function (s) {
    var e = {},
        i, b = 0,
        c, x, l = 0,
        a, r = '',
        w = String.fromCharCode,
        L = s.length;
    var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0; i < 64; i++) e[A.charAt(i)] = i;
    for (x = 0; x < L; x++) {
        c = e[s.charAt(x)];
        b = (b << 6) + c;
        l += 6;
        while (l >= 8) {
            ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a));
        }
    }
    return r;
};
// config
window.SG.env = window.SG.utils.getParameterByName('env') || window.SG.env;
// load
config.userId = window.SG.utils.getParameterByName('user') || config.userId;
config.token = window.SG.utils.getParameterByName('token') || config.token;
config.room = window.SG.utils.getParameterByName('room') || config.room;
config.tableId = window.SG.utils.getParameterByName('tableId') || config.tableId;
config.roomId = window.SG.utils.getParameterByName('roomId') || config.roomId;
config.lang = window.SG.utils.getParameterByName('lang') || config.lang;
config.scene = window.SG.utils.getParameterByName('scene') || config.scene;
config.avatarHost = window.SG.utils.getParameterByName('avatarUrl') || config.avatarHost;
config.network.host = window.SG.utils.getParameterByName('network.host') || config.network.host;
config.network.port = parseInt(window.SG.utils.getParameterByName('network.port')) || config.network.port;
config.network.zone = window.SG.utils.getParameterByName('network.zone') || config.network.zone;