describe('Breakthrough', function () {
    integration(function () {
        describe('Breakthrough', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'aggressive-moto'],
                        hand: ['breakthrough']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        provinces: ['shameful-display', 'entrenched-position'],
                    }
                });

                this.motoHorde = this.player1.findCardByName('moto-horde');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.breakthrough = this.player1.findCardByName('breakthrough');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.shamefulDisplay = this.player2.provinces['province 1'].provinceCard;
                this.entrenchedPosition = this.player2.provinces['province 2'].provinceCard;
                this.noMoreActions();
            });

            it('should initiate the second conflict after breaking a province in the first one', function () {
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.breakthrough);
                this.player1.clickCard(this.breakthrough);
                expect(this.player1).toHavePrompt('Initiate Conflict');
            });

            it('should still allow the opponent to use both their conflict opportunities', function() {
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    ring: 'air',
                    type: 'military',
                    defenders: [],
                    province: this.shamefulDisplay
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                this.player1.clickCard(this.breakthrough);
                this.initiateConflict({
                    attackers: [this.aggressiveMoto],
                    defenders: [],
                    ring: 'void',
                    type: 'political',
                    province: this.entrenchedPosition
                });
                this.noMoreActions();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
                this.player2.passConflict();
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Initiate Conflict');
            });

            it('should not trigger if there are no more valid attackers for the second conflict', function () {
                this.initiateConflict({
                    attackers: [this.motoHorde, this.aggressiveMoto],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if it is not the first conflict this round', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.motoHorde, this.aggressiveMoto],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if the province was not broken', function () {
                this.initiateConflict({
                    attackers: [this.aggressiveMoto],
                    defenders: [this.mirumotoRaitsugu]
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });

        describe('Waning Hostilities', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'aggressive-moto'],
                        hand: ['breakthrough']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['waning-hostilities']
                    }
                });

                this.motoHorde = this.player1.findCardByName('moto-horde');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.breakthrough = this.player1.findCardByName('breakthrough');
                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.waningHostilities = this.player2.findCardByName('waning-hostilities');

                this.player2.clickCard(this.waningHostilities);
                this.noMoreActions();
            });

            it('should prevent Breakthrough from triggering', function () {
                this.initiateConflict({
                    attackers: [this.motoHorde],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
