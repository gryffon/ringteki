class Clock {
    constructor(player, time) {
        this.player = player;
        this.mainTime = time;
        this.timeLeft = time;
        this.mode = 'off';
        this.timerStart = 0;
        this.paused = false;
        this.stateId = 0;
        this.name = 'Clock';
    }

    pause() {
        this.paused = true;
    }

    restart() {
        this.paused = false;
    }

    modify(secs) {
        this.timeLeft += secs;
    }

    updateStateId() {
        this.stateId++;
    }

    start() {
        if(!this.paused) {
            this.timerStart = Date.now();
            this.updateStateId();
        }
    }

    stop() {
        if(this.timerStart > 0) {
            this.updateTimeLeft(Math.floor(((Date.now() - this.timerStart) / 1000) + 0.5));
            this.timerStart = 0;
            this.updateStateId();
        }
    }

    reset() {
    }

    opponentStart() {
        this.timerStart = Date.now();
        this.updateStateId();
    }

    timeRanOut() {
        return;
    }

    updateTimeLeft(secs) {
        if(this.timeLeft === 0 || secs < 0) {
            return;
        }
        if(this.mode === 'down') {
            this.modify(-secs);
            if(this.timeLeft < 0) {
                this.timeLeft = 0;
                this.timeRanOut();
            }
        } else if(this.mode === 'up') {
            this.modify(secs);
        }
    }

    getState() {
        return {
            mode: this.mode,
            timeLeft: this.timeLeft,
            stateId: this.stateId,
            mainTime: this.mainTime,
            name: this.name
        };
    }
}

module.exports = Clock;
