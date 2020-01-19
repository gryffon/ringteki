describe('Austere Exemplar', function() {
    integration(function() {
        describe('Austere Exemplar', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['austere-exemplar', 'agasha-swordsmith'],
                        hand: ['fine-katana', 'ornate-fan', 'void-fist']
                    },
                    player2: {
                        inPlay: ['brash-samurai']
                    }
                });
                this.austereExemplar = this.player1.findCardByName('austere-exemplar');
                this.void = this.player1.findCardByName('void-fist');
                this.brash = this.player2.findCardByName('brash-samurai');
                this.player2.claimRing('earth');
            });

            it('should not work if not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['agasha-swordsmith'],
                    defenders: ['brash-samurai']
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.austereExemplar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not work if defending', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['brash-samurai'],
                    defenders: [this.austereExemplar]
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.austereExemplar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should permit three consecutive actions', function() {
                let ringFate = this.game.rings.water.fate;
                let playerFate = this.player1.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.austereExemplar],
                    defenders: [this.brash],
                    ring: 'air'
                });
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.austereExemplar);
                expect(this.player1).toHavePrompt('Select a ring to place fate on');
                expect(this.player1).not.toBeAbleToSelectRing('air');
                expect(this.player1).not.toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).toBeAbleToSelectRing('void');
                expect(this.player1).toBeAbleToSelectRing('water');
                this.player1.clickRing('water');

                expect(this.game.rings.water.fate).toBe(ringFate + 1);
                expect(this.player1.fate).toBe(playerFate - 1);

                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.playAttachment('fine-katana', this.austereExemplar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.playAttachment('ornate-fan', this.austereExemplar);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.clickCard(this.void);
                this.player1.clickCard(this.brash);
                expect(this.brash.bowed).toBe(true);
                expect(this.brash.inConflict).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it('passing extra actions should not end the conflict', function() {
                let ringFate = this.game.rings.water.fate;
                let playerFate = this.player1.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.austereExemplar],
                    defenders: [this.brash],
                    ring: 'air'
                });
                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.austereExemplar);
                expect(this.player1).toHavePrompt('Select a ring to place fate on');
                expect(this.player1).toBeAbleToSelectRing('water');
                this.player1.clickRing('water');

                expect(this.game.rings.water.fate).toBe(ringFate + 1);
                expect(this.player1.fate).toBe(playerFate - 1);

                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.pass(); //additional action 1
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.pass(); //additional action 2
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player1.pass(); //additional action 3

                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                this.player2.pass(); //both players pass consecutively, should end the conflict
                expect(this.player1).toHavePrompt('Choose an effect to resolve');
            });
        });
    });
});
