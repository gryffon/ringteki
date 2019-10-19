describe('Invoke the Divine', function() {
    integration(function() {
        describe('Invoke the Divne\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['invoke-the-divine', 'against-the-waves', 'supernatural-storm', 'consumed-by-five-fires', 'benten-s-touch']
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['voice-of-honor', 'watch-commander']
                    }

                });
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.invoke = this.player1.findCardByName('invoke-the-divine');
                this.against = this.player1.findCardByName('against-the-waves');
                this.storm = this.player1.findCardByName('supernatural-storm');
                this.consumed = this.player1.findCardByName('consumed-by-five-fires');
                this.benten = this.player1.findCardByName('benten-s-touch');

                this.keeper.fate = 1;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept],
                    defenders: [this.keeper]
                });
            });

            it('let you choose spells if they cost less than 6', function() {
                this.player2.pass();
                this.player1.clickCard(this.invoke);
                expect(this.player1).toHavePrompt('Invoke the divine');
                expect(this.player1).toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).toBeAbleToSelect(this.consumed);
                expect(this.player1).toBeAbleToSelect(this.storm);
            });

            it('should let you choose three spells if the total less than 6', function() {
                this.player2.pass();
                this.player1.clickCard(this.invoke);
                this.player1.clickCard(this.against);
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.adept);
                expect(this.adept.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Invoke the Divine');
                expect(this.player1).not.toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).not.toBeAbleToSelect(this.consumed);
                expect(this.player1).toBeAbleToSelect(this.storm);
                this.player1.clickCard(this.storm);
                expect(this.player1).toHavePrompt('Supernatural storm');
                this.player1.clickCard(this.adept);
                expect(this.player1).toHavePrompt('Invoke the divine');
                expect(this.player1).not.toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).not.toBeAbleToSelect(this.consumed);
                expect(this.player1).not.toBeAbleToSelect(this.storm);
                this.player1.clickCard(this.benten);
                expect(this.player1).toHavePrompt('Benten\'s touch');
                this.player1.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.adept.bowed).toBe(true);
                expect(this.adept.getMilitarySkill()).toBe(5);
                expect(this.adept.isHonored).toBe(true);
            });

            it('should allow the player to cancel correctly', function() {
                this.player2.pass();
                this.player1.clickCard(this.invoke);
                expect(this.player1).toHavePrompt('Invoke the Divine');
                expect(this.player1).toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.storm);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).toBeAbleToSelect(this.consumed);
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player1).not.toHavePromptButton('Cancel');
                this.player1.clickCard(this.against);
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Invoke the Divine');
                expect(this.player1).toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.storm);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).toBeAbleToSelect(this.consumed);
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player1).not.toHavePromptButton('Cancel');
                this.player1.clickCard(this.consumed);
                this.player1.clickCard(this.keeper);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Invoke the Divine');
                expect(this.player1).not.toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.storm);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).not.toBeAbleToSelect(this.consumed);
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).not.toHavePromptButton('Cancel');
                this.player1.clickCard(this.storm);
                expect(this.player1).toHavePrompt('Supernatural Storm');
                expect(this.player1).toHavePromptButton('Cancel');
                this.player1.clickPrompt('Cancel');
                expect(this.player1).toHavePrompt('Invoke the Divine');
                expect(this.player1).not.toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.storm);
                expect(this.player1).toBeAbleToSelect(this.benten);
                expect(this.player1).not.toBeAbleToSelect(this.consumed);
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).not.toHavePromptButton('Cancel');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not let you select more than 6 fate worth of spells', function() {
                this.player2.pass();
                this.player1.clickCard(this.invoke);
                this.player1.clickCard(this.consumed);
                this.player1.clickCard(this.keeper);
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Invoke the divine');
                expect(this.player1).not.toBeAbleToSelect(this.against);
                expect(this.player1).toBeAbleToSelect(this.storm);
            });

            it('should let the opponent cancel the spells from invoke', function() {
                this.keeper.honor();
                this.player2.pass();
                this.player1.clickCard(this.invoke);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Invoke the divine');
                this.player1.clickCard(this.against);
                expect(this.player1).toHavePrompt('Against the waves');
                this.player1.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Triggered Abilities');
            });

            it('should let you opponent trigger watch commmander for each spell', function() {
                const startingHonor = this.player1.player.honor;
                this.watchCommander = this.player2.playAttachment('watch-commander', this.keeper);
                this.player1.clickCard(this.invoke);
                expect(this.player1).toHavePrompt('Invoke the Divine');
                this.player1.clickCard(this.storm);
                this.player1.clickCard(this.adept);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.watchCommander);
                expect(startingHonor - this.player1.player.honor).toBe(1);
                expect(this.player1).toHavePrompt('Invoke the Divine');
            });
        });
    });
});
