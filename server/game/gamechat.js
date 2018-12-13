const _ = require('underscore');

class GameChat {
    constructor() {
        this.messages = [];
    }

    addChatMessage(player, message) {
        let playerArg = {
            name: player.user.username,
            emailHash: player.user.emailHash,
            noAvatar: player.user.settings.disableGravatar
        };

        this.addMessage('{0} {1}', playerArg, message);
    }

    addMessage(message, ...args) {
        let formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addAlert(type, message, ...args) {
        let formattedMessage = this.formatMessage(message, args);

        this.messages.push({ date: new Date(), message: { alert: { type: type, message: formattedMessage } } });
    }

    formatMessage(format, args) {
        if(!format) {
            return '';
        }

        let fragments = format.split(/(\{\d+\})/);
        return fragments.reduce((output, fragment) => {
            let argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch) {
                let arg = args[argMatch[1]];
                if(arg) {
                    if(arg.message) {
                        return output.concat(arg.message);
                    } else if(Array.isArray(arg)) {
                        return output.concat(this.formatArray(arg));
                    } else if(arg.getShortSummary) {
                        return output.concat(arg.getShortSummary());
                    } else {
                        return output.concat(arg);
                    }
                }
            } else if(fragment) {
                let splitFragment = fragment.split(' ');
                let lastWord = splitFragment.pop();
                return splitFragment.reduce((output, word) => {
                    return output.concat(word || [], ' ');
                }, output).concat(lastWord || []);
            }
            return output;
        }, []);
    }

    formatArray(array) {
        if(array.length === 0) {
            return [];
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

        return this.formatMessage(format, array);
    }
}

module.exports = GameChat;
