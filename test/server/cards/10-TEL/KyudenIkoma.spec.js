describe('Kyüden Ikoma', function() {
    integration(function() {
        describe('Kyüden Ikoma\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-ikoma',
                        inPlay: ['akodo-toturi', 'ikoma-prodigy']
                    },
                    player2: {
                        inPlay: ['hida-kisada', 'kaiu-shuichi'],
                        hand: ['the-mountain-does-not-fall', 'assassination']
                    }
                });

                this.kyudenIkoma = this.player1.findCardByName('kyuden-ikoma');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');

                this.hidaKisada = this.player2.findCardByName('hida-kisada');
                this.kaiuShuichi = this.player2.findCardByName('kaiu-shuichi');
                this.mountainDoesNotFall = this.player2.findCardByName('the-mountain-does-not-fall');
                this.assassination = this.player2.findCardByName('assassination');
            });

            it('should trigger when you lose a conflict with an attacking character and make you bow a non-champion', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.kaiuShuichi]
                });

                this.player2.clickCard(this.mountainDoesNotFall);
                this.player2.clickCard(this.kaiuShuichi);
                this.player1.pass();
                this.player2.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kyudenIkoma);
                this.player1.clickCard(this.kyudenIkoma);
                expect(this.player1).toHavePrompt('Bow a non-champion');

                expect(this.player1).toBeAbleToSelect(this.ikomaProdigy);
                expect(this.player1).toBeAbleToSelect(this.kaiuShuichi);

                this.player1.clickCard(this.kaiuShuichi);

                expect(this.getChatLogs(10)).toContain('player1 uses Kyūden Ikoma, bowing Kyūden Ikoma to bow Kaiu Shuichi.');
                expect(this.kaiuShuichi.bowed).toBe(true);
            });

            it('should not trigger when you lose a conflict without an attacking character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.kaiuShuichi]
                });

                this.player2.clickCard(this.mountainDoesNotFall);
                this.player2.clickCard(this.kaiuShuichi);
                this.player1.pass();
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.ikomaProdigy);
                this.player1.pass();
                this.player2.pass();

                expect(this.ikomaProdigy.inConflict).toBe(false);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when you lose a conflict on defense', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kaiuShuichi]
                });
                this.player2.clickPrompt('No Target');
                this.player1.clickCard(this.ikomaProdigy);
                this.player1.clickPrompt('Done');

                this.player1.pass();
                this.player2.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
