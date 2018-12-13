const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const { Phases, EventNames } = require('../Constants');

class Phase extends BaseStepWithPipeline {
    constructor(game, name) {
        super(game);
        this.name = name;
    }

    initialise(steps) {
        var startStep = new SimpleStep(this.game, () => this.startPhase());
        var endStep = new SimpleStep(this.game, () => this.endPhase());
        this.pipeline.initialise([startStep].concat(steps).concat([endStep]));
    }

    startPhase() {
        this.game.raiseEvent(EventNames.OnPhaseStarted, { phase: this.name }, () => {
            this.game.currentPhase = this.name;
            if(this.name === Phases.Dynasty) {
                this.game.roundNumber++;
                this.game.conflictRecord = [];
            }
            if(this.name !== 'setup') {
                this.game.addAlert('endofround', 'turn: {0} - {1} phase', this.game.roundNumber, this.name);
            }
        });
    }

    endPhase() {
        this.game.raiseEvent(EventNames.OnPhaseEnded, { phase: this.name });
        this.game.currentPhase = '';
    }
}

module.exports = Phase;
