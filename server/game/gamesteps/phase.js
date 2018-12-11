const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');

class Phase extends BaseStepWithPipeline {
    constructor(game, name) {
        super(game);
        this.name = name;
        this.steps = [];
    }

    initialise(steps) {
        this.pipeline.initialise([new SimpleStep(this.game, () => this.createPhase())]);
        let startStep = new SimpleStep(this.game, () => this.startPhase());
        let endStep = new SimpleStep(this.game, () => this.endPhase());
        this.steps = [startStep].concat(steps).concat([endStep]);
    }

    createPhase() {
        this.game.raiseEvent('onPhaseCreated', { phase: this.name }, () => {
            for(let step of this.steps) {
                this.game.queueStep(step);
            }
        });
    }

    startPhase() {
        this.game.raiseEvent('onPhaseStarted', { phase: this.name }, () => {
            this.game.currentPhase = this.name;
            if(this.name !== 'setup') {
                this.game.addAlert('endofround', 'turn: {0} - {1} phase', this.game.roundNumber, this.name);
            }
        });
    }

    endPhase() {
        this.game.raiseEvent('onPhaseEnded', { phase: this.name });
        this.game.currentPhase = '';
    }
}

module.exports = Phase;
