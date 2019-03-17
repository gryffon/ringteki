describe('Hida Tsuru', function() {
    integration(function() {
        describe('Hida Tsuru ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-tsuru','eager-scout'],
                        dynastyDeck: ['favorable-ground'],
                        hand : ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['stoic-gunso']
                    }
                });
                this.fg = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.hidaTsuru = this.player1.findCardByName('hida-tsuru');
                this.scout = this.player1.findCardByName('eager-scout');
                this.stewardOfLaw = this.player1.findCardByName('steward-of-law');

                this.shinjoOutrider = this.player2.findCardByName('shinjo-outrider');
                this.stoicGunso = this.player2.findCardByName('stoic-gunso');

                this.noMoreActions();
            });

            it('should trigger when a friendly character moves to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.fg);
                this.player1.clickCard(this.scout);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaTsuru);
            });

            it('should trigger when an opposing character moves to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaTsuru);
            });

            it('should trigger when it moves  itself to the conflict', function() {
                this.initiateConflict({
                    attackers: [this.scout],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.fg);
                this.player1.clickCard(this.hidaTsuru);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaTsuru);
            });

            it('should trigger when a friendly character is played into the conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaTsuru);
            });

            it('should trigger when an opposing character is played into the conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.clickCard(this.stoicGunso);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hidaTsuru);
            });

            it('should not trigger when a character is played at home during a conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.clickCard(this.stoicGunso);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Home');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger if he is not participating in the conflict', function() {
                this.initiateConflict({
                    attackers: [this.scout],
                    defenders: []
                });
                this.player2.clickCard(this.stoicGunso);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Home');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.pass();
                this.player2.clickCard(this.shinjoOutrider);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should give him +1/+1', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.clickCard(this.stoicGunso);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.clickCard(this.hidaTsuru);
                expect(this.hidaTsuru.getMilitarySkill()).toBe(5);
                expect(this.hidaTsuru.getPoliticalSkill()).toBe(4);
            });

            it('should trigger multiple times in a conflict', function() {
                this.initiateConflict({
                    attackers: [this.hidaTsuru],
                    defenders: []
                });
                this.player2.clickCard(this.stoicGunso);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.clickCard(this.hidaTsuru);
                expect(this.hidaTsuru.getMilitarySkill()).toBe(5);
                expect(this.hidaTsuru.getPoliticalSkill()).toBe(4);
                this.player1.clickCard(this.fg);
                this.player1.clickCard(this.scout);
                this.player1.clickCard(this.hidaTsuru);
                expect(this.hidaTsuru.getMilitarySkill()).toBe(6);
                expect(this.hidaTsuru.getPoliticalSkill()).toBe(5);
                this.player2.clickCard(this.shinjoOutrider);
                this.player1.clickCard(this.hidaTsuru);
                expect(this.hidaTsuru.getMilitarySkill()).toBe(7);
                expect(this.hidaTsuru.getPoliticalSkill()).toBe(6);
                this.player1.clickCard(this.stewardOfLaw);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player1.clickCard(this.hidaTsuru);
                expect(this.hidaTsuru.getMilitarySkill()).toBe(8);
                expect(this.hidaTsuru.getPoliticalSkill()).toBe(7);
            });
        });
    });
});
