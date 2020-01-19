describe('Sententious Poet', function() {
    integration(function() {
        describe('Sententious Poet\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['sententious-poet', 'utaku-tetsuko', 'inquisitive-ishika']
                    },
                    player2: {
                        inPlay: ['wandering-ronin', 'daidoji-uji', 'master-alchemist'],
                        hand: ['tattooed-wanderer', 'fine-katana', 'warm-welcome', 'against-the-waves'],
                        conflictDiscard: ['finger-of-jade'],
                        dynastyDiscard: ['doji-whisperer', 'mantis-tenkinja', 'eager-scout']
                    }
                });
                this.sententiousPoet = this.player1.findCardByName('sententious-poet');
                this.utakuTetsuko = this.player1.findCardByName('utaku-tetsuko');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
                this.daidojiUji = this.player2.findCardByName('daidoji-uji');
                this.masterAlchemist = this.player2.findCardByName('master-alchemist');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.warmWelcome = this.player2.findCardByName('warm-welcome');
                this.fingerOfJade = this.player2.findCardByName('finger-of-jade');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.mantisTenkinja = this.player2.findCardByName('mantis-tenkinja');
                this.scout = this.player2.findCardByName('eager-scout');
                this.againstTheWaves = this.player2.findCardByName('against-the-waves');
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
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: [],
                    ring: 'water'
                });
                this.player2.clickCard(this.againstTheWaves);
                this.player2.clickCard(this.masterAlchemist);
                expect(this.masterAlchemist.bowed).toBe(true);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when additional fate is placed on a character (when the character fate cost was 0)', function() {
                this.daidojiUji.honor();
                this.player1.placeCardInProvince(this.scout, 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.scout);
                this.player2.clickPrompt('2');
                this.player2.clickPrompt('Conflict');
                expect(this.scout.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger when a card has not been played', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.masterAlchemist);
                this.player2.clickCard(this.wanderingRonin);
                this.player2.clickRing('fire');
                expect(this.player2).toHavePrompt('Master Alchemist');
            });

            it('should trigger when costs are paid when a card is played by an ability', function() {
                this.player1.player.showBid = 5;
                this.player2.player.showBid = 4;
                this.player2.moveCard(this.mantisTenkinja, 'play area');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.sententiousPoet],
                    defenders: []
                });
                this.player2.clickCard(this.warmWelcome);
                this.player2.clickCard(this.fingerOfJade);
                this.player2.clickCard(this.mantisTenkinja);
                this.player2.clickCard(this.wanderingRonin);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sententiousPoet);
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
