describe('Sententious Poet', function() {
    integration(function() {
        describe('Sententious Poet\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sententious-poet', 'utaku-tetsuko'],
                        hand: ['for-shame']
                    },
                    player2: {
                        inPlay: ['wandering-ronin', 'daidoji-uji', 'ascetic-visionary'],
                        hand: ['tattooed-wanderer', 'fine-katana'],
                        dynastyDiscard: ['doji-whisperer']
                    }
                });
                this.sententiousPoet = this.player1.findCardByName('sententious-poet');
                this.utakuTetsuko = this.player1.findCardByName('utaku-tetsuko');
                this.forShame = this.player1.findCardByName('for-shame');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.daidojiUji = this.player2.findCardByName('daidoji-uji');
                this.asceticVisionary = this.player2.findCardByName('ascetic-visionary');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.fineKatana = this.player2.findCardByName('fine-katana');
            });

            it('should trigger when a character is played with a cost of 1 fate', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.tattooedWanderer);
                this.player2.clickPrompt('Play this character');
                this.player2.clickPrompt('0');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sententiousPoet);
            });

            it('should not trigger when an attachment is played with a cost of 0 fate', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.wanderingRonin);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger when the cost is increased by Tetsuko', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet, this.utakuTetsuko],
                    defenders: []
                });
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.wanderingRonin);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sententiousPoet);
            });

            it('should not trigger when the cost is reduced to 0', function() {
                this.daidojiUji.honor();
                this.player1.placeCardInProvince(this.dojiWhisperer, 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when additional fate is placed on a character (when the character fate cost was 0)', function() {
                this.daidojiUji.honor();
                this.player1.placeCardInProvince(this.dojiWhisperer, 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.dojiWhisperer);
                this.player2.clickPrompt('2');
                this.player2.clickPrompt('Conflict');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when a card has not been played', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asceticVisionary],
                    defenders: [this.sententiousPoet]
                });
                this.player1.clickCard(this.forShame);
                this.player1.clickCard(this.asceticVisionary);
                this.player2.clickPrompt('Bow this character');
                expect(this.asceticVisionary.bowed).toBe(true);
                this.player2.clickCard(this.asceticVisionary);
                this.player2.clickCard(this.asceticVisionary);
                this.player2.clickRing('fire');
                expect(this.asceticVisionary.bowed).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should give you 1 fate', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.tattooedWanderer);
                this.player2.clickPrompt('Play this character');
                this.player2.clickPrompt('0');
                let fate = this.player1.player.fate;
                this.player1.clickCard(this.sententiousPoet);
                expect(this.player1.player.fate).toBe(fate + 1);
                expect(this.getChatLogs(3)).toContain('player1 uses Sententious Poet to gain 1 fate');
            });
        });
    });
});
