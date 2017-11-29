/**
 * Created by Jackie on 7/25/17.
 */
module.exports = {
    tweenNumber: function(label, toNumber, duration, fixedPoint, formatter) {
        if (!label || !(label instanceof cc.Label)) {
            return;
        }
        var action = new cc.targetedAction(label, new cc.TweenNumber(duration, 'string', toNumber || 0, fixedPoint, formatter));
        // Fast moving more than the finish, and then slowly back to the finish.
        action.easing(cc.easeQuinticActionOut());
        label.node.runAction(action);
    },
    numberWithCustomSeparator: function(x, separator, floatSeparator, fixedPoint) {
        if (!separator) separator = ',';
        else separator = separator[0] || ',';
        if (!floatSeparator) floatSeparator = '.';
        else floatSeparator = floatSeparator[0] || '.';
        fixedPoint = fixedPoint || 0;
        var parts = x.toString().split('.');
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator) + (parts[1] && fixedPoint >= 0 ? floatSeparator + (fixedPoint >= 0 ? parseFloat(parts[1]).toFixed(fixedPoint) : parts[1]) : '');
    },
    numberWithCustomSeparatorToFloat: function(x, separator, floatSeparator) {
        separator = separator || ',';
        floatSeparator = floatSeparator || '.';
        separator = '\\' + separator;
        floatSeparator = '\\' + floatSeparator;
        return parseFloat(x.toString().replace(new RegExp(separator), '').replace(new RegExp(floatSeparator), '.'));
    },
    numberWithCommas: function(x, fixedPoint) {
        fixedPoint = fixedPoint || 0;
        var parts = x.toString().split('.');
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] && fixedPoint >= 0 ? "." + (fixedPoint >= 0 ? parseFloat(parts[1]).toFixed(fixedPoint) : parts[1]) : '');
    },
    numberWithCommasToFloat: function(x) {
        return x.toString().replace(/,/g, '');
    },
    loadTexture: function(url, loadCallBack) {
        cc.loader.load(url, function(err, res) {
            if (err) {
                cc.warn(err);
                if (!!loadCallBack && typeof loadCallBack === 'function') {
                    loadCallBack(err);
                }
                return;
            }
            if (!!loadCallBack && typeof loadCallBack === 'function') {
                loadCallBack(null, res);
            }
        });
    },
    getDewaAvatar: function(userId) {
        userId = (userId || '') + '' || '';
        var host = SG.config.avatarHost || '';
        if (host[host.length - 1] !== '/') {
            host += '/';
        }
        return host + ((userId[0] || '').toUpperCase() + '/' + userId.toUpperCase()) + '.jpg';
    },
    convertCardsToHandTypeCards: function(cards) {
        var result = [];
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (!!!card) {
                continue;
            }
            var cardSuit = parseInt(Math.floor(card / 100000));
            var cardRank = parseInt(card % 100000);
            switch (cardSuit) {
                case (1):
                    cardSuit = 'd';
                    break;
                case (2):
                    cardSuit = 's';
                    break;
                case (3):
                    cardSuit = 'h';
                    break;
                case (4):
                    cardSuit = 'c';
                    break;
            }
            switch (cardRank) {
                case (10):
                    cardRank = 'T';
                    break;
                case (11):
                    cardRank = 'J';
                    break;
                case (12):
                    cardRank = 'Q';
                    break;
                case (13):
                    cardRank = 'K';
                    break;
                case (14):
                    cardRank = 'A';
                    break;
                case (1):
                    cardRank = 'A';
                    break;
            }
            card = cardRank.toString() + cardSuit.toString();
            result.push(card);
        }
        return result;
    },
    exitApplication: function() {
        if (cc.sys.isBrowser === true) {
            var isFrame = window.parent !== window;
            if (isFrame) {
                window.parent.close();
            } else {
                window.close();
            }
        }
    }
};