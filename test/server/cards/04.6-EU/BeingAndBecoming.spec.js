describe('Being And Becoming', function() {
    integration(function () {
        describe('Being and Becoming', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate'],
                        hand: ['being-and-becoming']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: []
                    }
                });
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.beingAndBecoming = this.player1.findCardByName('being-and-becoming');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
            });

            it('should only be able to be attached to character you control', function () {
                this.player1.clickCard(this.beingAndBecoming);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.togashiInitiate);
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });

        describe('Being And Becoming\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate','togashi-mendicant'],
                        hand: ['being-and-becoming']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: []
                    }
                });
                this.initiate = this.player1.findCardByName('togashi-initiate');
                this.mendicant = this.player1.findCardByName('togashi-mendicant');
                this.bab = this.player1.findCardByName('being-and-becoming');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');

                this.game.rings.fire.fate = 2;
            });

            it('should work on rings with fate', function() {
                this.player1.clickCard(this.bab);
                this.player1.clickCard(this.mendicant);
                this.player2.pass();
                this.player1.clickCard(this.bab);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
                expect(this.game.rings.fire.fate).toBe(2);
                this.player1.clickRing('fire');
                expect(this.game.rings.fire.fate).toBe(0);
                expect(this.mendicant.fate).toBe(2);
                expect(this.initiate.fate).toBe(0);
                expect(this.mendicant.bowed).toBe(true);
            });

            it('should not work on rings without fate', function() {
                this.player1.clickCard(this.bab);
                this.player1.clickCard(this.mendicant);
                this.player2.pass();
                this.player1.clickCard(this.bab);
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
                expect(this.game.rings.air.fate).toBe(0);
                this.player1.clickRing('air');
                expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
            });
        });
    });
});
