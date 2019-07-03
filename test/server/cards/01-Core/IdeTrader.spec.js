describe('Ide Trader', function() {
    integration(function() {
        describe('Ide Trader ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 8,
                        inPlay: ['ide-trader', 'shinjo-outrider', 'iuchi-wayfinder'],
                        hand: ['favored-mount', 'spyglass'],
                        dynastyDeck: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.ideTrader = this.player1.findCardByName('ide-trader');
                this.favoredMount = this.player1.playAttachment('favored-mount', this.ideTrader);
                this.noMoreActions();
            });

            it('should trigger when another character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should give the player the choice between fate or a card', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                expect(this.player1.currentButtons).toContain('Gain 1 fate');
                expect(this.player1.currentButtons).toContain('Draw 1 card');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1.fate).toBe(8);
            });

            it('should draw a card when the player chooses that option', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                expect(this.player1.currentButtons).toContain('Gain 1 fate');
                expect(this.player1.currentButtons).toContain('Draw 1 card');
                this.player1.clickPrompt('Draw 1 card');
                expect(this.player1.player.hand.size()).toBe(2);
            });

            it('should trigger when an opposing character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should trigger when ide trader joins a conflict', function() {
                this.initiateConflict({
                    attackers: ['iuchi-wayfinder'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should trigger in the same window as spyglass', function() {
                this.initiateConflict({
                    attackers: ['iuchi-wayfinder'],
                    defenders: []
                });
                this.player2.pass();
                this.spyglass = this.player1.playAttachment('spyglass', this.ideTrader);
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
                expect(this.player1).toBeAbleToSelect(this.spyglass);
            });
        });

        describe('Ide Trader/Charge interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        dynastyDeck: ['ide-trader'],
                        hand: ['charge']
                    }
                });
                this.ideTrader = this.player1.placeCardInProvince('ide-trader');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should not trigger Ide Trader when it is Charged', function() {
                this.player1.clickCard('charge');
                this.player1.clickCard(this.ideTrader);
                expect(this.ideTrader.inConflict).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ideTrader);
            });
        });

        describe('when multiple characters move to the conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['seppun-guardsman', 'ide-trader', 'shinjo-tatsuo'],
                        hand: ['seal-of-the-dragon', 'way-of-the-dragon'],
                        dynastyDiscard: ['favorable-ground']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.ideTrader = this.player1.findCardByName('ide-trader');
                this.sealOfTheDragon = this.player1.playAttachment('seal-of-the-dragon', this.ideTrader);
                this.player2.pass();
                this.wayOfTheDragon = this.player1.playAttachment('way-of-the-dragon', this.ideTrader);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('if they move separately, Ide Trader\'s ability should trigger twice', function() {
                expect(this.ideTrader.attachments.toArray()).toContain(this.sealOfTheDragon);
                expect(this.ideTrader.attachments.toArray()).toContain(this.wayOfTheDragon);
                expect(this.player1.fate).toBe(0);
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.ideTrader);
                expect(this.ideTrader.inConflict).toBe(true);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1.fate).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.shinjoTatsuo = this.player1.clickCard('shinjo-tatsuo');
                expect(this.player1).toHavePrompt('Shinjo Tatsuo');
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1.fate).toBe(2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('Ide Trader\'s ability should only trigger once', function() {
                expect(this.ideTrader.attachments.toArray()).toContain(this.sealOfTheDragon);
                expect(this.ideTrader.attachments.toArray()).toContain(this.wayOfTheDragon);
                expect(this.player1.fate).toBe(0);
                this.shinjoTatsuo = this.player1.clickCard('shinjo-tatsuo');
                expect(this.player1).toHavePrompt('Shinjo Tatsuo');
                this.player1.clickCard(this.shinjoTatsuo);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1.fate).toBe(1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
