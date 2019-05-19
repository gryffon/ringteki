const GameObject = require('./GameObject');

class StatusToken extends GameObject {
    constructor(game, card, isHonored) {
        super(game, isHonored ? 'Honored Token' : 'Dishonored Token');
        this.honored = !!isHonored;
        this.dishonored = !isHonored;
        this.card = card;
        this.type = 'token';
    }
}

module.exports = StatusToken;
