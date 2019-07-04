const ChessClock = require('./ChessClock');

class Hourglass extends ChessClock {
    constructor(player, time) {
        super(player, time);
        this.name = 'Hourglass';
    }

    opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}

module.exports = Hourglass;
