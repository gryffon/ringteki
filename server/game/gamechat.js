const _ = require('underscore');

const EffectSource = require('./EffectSource');
const Spectator = require('./spectator.js');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(message) {
        var args = Array.from(arguments).slice(1);
        var formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    getFormattedMessage(message) {
        var args = Array.from(arguments).slice(1);
        var argList = [];

        args = _.reduce(args, (argList, arg) => {
            if(arg instanceof Spectator) {
                argList.push(arg.name);
            } else if(arg && arg.emailHash) {
                argList.push({ name: arg.name, emailHash: arg.emailHash, noAvatar: arg.user.settings.disableGravatar });
            } else {
                argList.push(arg);
            }

            return argList;
        }, argList);

        return this.formatMessage(message, args);
    }

    addMessage(message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.getFormattedMessage(message, ...args);

        this.messages.push({ date: new Date(), message: { alert: { type: type, message: formattedMessage } } });
    }

    formatMessage(format, args) {
        if(_.isNull(format) || _.isUndefined(format)) {
            return '';
        }

        var messageFragments = format.split(/(\{\d+\})/);

        return _.map(messageFragments, fragment => {
            var argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                var arg = args[argMatch[1]];
                if(!_.isUndefined(arg) && !_.isNull(arg)) {
                    if(_.isArray(arg)) {
                        return this.formatArray(arg);
                    } else if(arg instanceof EffectSource) {
                        return { id: arg.id, label: arg.name, type: arg.getType() };
                    } else if(arg instanceof Spectator) {
                        return { name: arg.user.username, emailHash: arg.user.emailHash, noAvatar: arg.user.settings.disableGravatar };
                    }

                    return arg;
                }

                return '';
            }

            return fragment;
        });
    }

    formatArray(array) {
        if(array.length === 0) {
            return '';
        }

        var format;

        if(array.length === 1) {
            format = '{0}';
        } else if(array.length === 2) {
            format = '{0} and {1}';
        } else {
            var range = _.map(_.range(array.length - 1), i => '{' + i + '}');
            format = range.join(', ') + ', and {' + (array.length - 1) + '}';
        }

        return { message: this.formatMessage(format, array) };
    }
}

module.exports = GameChat;
