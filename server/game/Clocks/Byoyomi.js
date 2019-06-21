const ChessClock = require('./ChessClock');

class Byoyomi extends ChessClock {
    reset() {
        this.timeLeft = Math.ceil((this.timeLeft) / 30) * 30;
    }
}

module.exports = Byoyomi;
