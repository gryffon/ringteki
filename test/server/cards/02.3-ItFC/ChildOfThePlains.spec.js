describe('Child of the Plains', function() {
    integration(function() {
        describe('Child of the Plains\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['child-of-the-plains']
                    },
                    player2: {
                        inPlay: ['wandering-ronin'],
                        hand: ['talisman-of-the-sun']
                    }
                });
                this.childOfThePlains = this.player1.findCardByName('child-of-the-plains');

                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');

                this.shamefulDisplay1 = this.player2.provinces['province 1'].provinceCard;
                this.shamefulDisplay2 = this.player2.provinces['province 2'].provinceCard;
            });

            it('should trigger after revealing a province during conflict declaration', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.childOfThePlains]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.childOfThePlains);
            });

            it('should not trigger if the province is already faceup', function() {
                this.shamefulDisplay1.facedown = false;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.childOfThePlains],
                    defenders: []
                });
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if the attack is moved to a new province during the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.childOfThePlains]
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.wanderingRonin);
                this.player1.pass();
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.shamefulDisplay2);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should give the attacking player the first action opportunity', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.childOfThePlains]
                });
                this.player1.clickCard(this.childOfThePlains);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });
    });
});
