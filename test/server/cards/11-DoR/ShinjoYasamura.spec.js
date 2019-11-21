describe('Shinjo Yasamura', function() {
    integration(function() {
        describe('Shinjo Yasamura\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-yasamura', 'border-rider']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith'],
                        hand: ['finger-of-jade']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.shinjoYasamura = this.player1.clickCard('shinjo-yasamura');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            });

            it('should trigger when Shinjo Yasamura uses covert', function() {
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.shamefulDisplay);
                this.player1.clickCard(this.shinjoYasamura);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toHavePrompt('Choose covert target for Shinjo Yasamura');
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.agashaSwordsmith.covert).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoYasamura);
                this.player1.clickCard(this.shinjoYasamura);
                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: [this.borderRider],
                    defenders: [this.agashaSwordsmith]
                });

                expect(this.agashaSwordsmith.isParticipating()).toBe(false);
            });

            it('should not trigger when cancelled by Finger of Jade', function() {
                this.player1.pass();
                this.fingerOfJade = this.player2.playAttachment('finger-of-jade', this.agashaSwordsmith);
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.shamefulDisplay);
                this.player1.clickCard(this.shinjoYasamura);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toHavePrompt('Choose covert target for Shinjo Yasamura');
                this.player1.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.fingerOfJade);
                this.player2.clickCard(this.fingerOfJade);
                expect(this.agashaSwordsmith.covert).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.shinjoYasamura);

                expect(this.player2).toHavePrompt('Choose Defenders');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.game.currentConflict.defenders).toContain(this.agashaSwordsmith);
                this.player2.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.player1).toHavePrompt('Action Window');
                this.agashaSwordsmith.bowed = false;
                this.noMoreActions();
                this.player2.passConflict();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'fire',
                    attackers: [this.borderRider],
                    defenders: [this.agashaSwordsmith]
                });

                expect(this.agashaSwordsmith.isParticipating()).toBe(true);
            });
        });
    });
});
