describe('Hida Sukune', function() {
    integration(function() {
        describe('Hida Sukune\'s Reaction', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-kuwanan']
                    },
                    player2: {
                        inPlay: ['hida-kisada', 'hida-sukune'],
                        hand: ['captive-audience', 'way-of-the-dragon'],
                        conflictDiscard: ['let-go']
                    }
                });

                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.kisada = this.player2.findCardByName('hida-kisada');
                this.sukune = this.player2.findCardByName('hida-sukune');
                this.captive = this.player2.findCardByName('captive-audience');
                this.dragon = this.player2.findCardByName('way-of-the-dragon');
                this.letGo = this.player2.findCardByName('let-go');

                this.player2.reduceDeckToNumber('conflict deck', 0);
                this.player2.moveCard(this.letGo, 'conflict deck');
            });

            it('should trigger on defense', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.sukune]
                });

                expect(this.letGo.location).toBe('conflict deck');
                this.player2.clickCard(this.sukune);
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.letGo.location).toBe('hand');
                expect(this.player2).toBeAbleToSelect(this.letGo);
                expect(this.player2).toBeAbleToSelect(this.captive);
                expect(this.player2).toBeAbleToSelect(this.dragon);

                this.player2.clickCard(this.captive);
                expect(this.captive.location).toBe('conflict discard pile');
            });

            it('should not trigger on attack', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sukune],
                    defenders: [this.kuwanan]
                });

                this.player1.pass();

                expect(this.letGo.location).toBe('conflict deck');
                this.player2.clickCard(this.sukune);
                expect(this.letGo.location).toBe('conflict deck');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if not participating', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada]
                });

                expect(this.letGo.location).toBe('conflict deck');
                this.player2.clickCard(this.sukune);
                expect(this.letGo.location).toBe('conflict deck');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should be able to trigger every conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada, this.sukune]
                });

                expect(this.letGo.location).toBe('conflict deck');
                this.player2.clickCard(this.sukune);
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.letGo.location).toBe('hand');
                expect(this.player2).toBeAbleToSelect(this.letGo);
                expect(this.player2).toBeAbleToSelect(this.captive);
                expect(this.player2).toBeAbleToSelect(this.dragon);

                this.player2.clickCard(this.captive);
                expect(this.captive.location).toBe('conflict discard pile');
                this.player2.reduceDeckToNumber('conflict deck', 0);
                this.player2.moveCard(this.captive, 'conflict deck');

                this.noMoreActions();

                this.kuwanan.bowed = false;
                this.kisada.bowed = false;
                this.sukune.bowed = false;

                this.noMoreActions();
                this.player2.passConflict();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: [this.kisada, this.sukune],
                    ring: 'fire'
                });

                expect(this.captive.location).toBe('conflict deck');
                this.player2.clickCard(this.sukune);
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.captive.location).toBe('hand');
                expect(this.player2).toBeAbleToSelect(this.letGo);
                expect(this.player2).toBeAbleToSelect(this.captive);
                expect(this.player2).toBeAbleToSelect(this.dragon);

                this.player2.clickCard(this.dragon);
                expect(this.dragon.location).toBe('conflict discard pile');
            });
        });
    });
});

