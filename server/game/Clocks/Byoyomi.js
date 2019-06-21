const ChessClock = require('./ChessClock');

class Byoyomi extends ChessClock {
    constructor(player, time, periods, timePeriod) {
        super(player, time);
        this.periods = periods;
        this.timePeriod = timePeriod;
        this.timeLeft = time + (periods * timePeriod);
    }

    reset() {
        if(this.timeLeft > 0 && this.timeLeft < this.periods * this.timePeriod) {
            this.periods = Math.ceil(this.timeLeft / this.timePeriod);
            this.timeLeft = this.periods * this.timePeriod;
        }
    }
}

module.exports = Byoyomi;
