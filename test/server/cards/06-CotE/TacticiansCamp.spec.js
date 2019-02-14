describe('Tactician\'s Camp', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-toturi','matsu-berserker'],
                    dynastyDiscard: ['tactician-s-camp']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });

            this.camp = this.player1.placeCardInProvince('tactician-s-camp', 'province 1');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.berserker = this.player1.findCardByName('matsu-berserker');

            this.whisperer = this.player2.findCardByName('doji-whisperer');

        });

        it('should only give honored characters +1 MIL', function() {
            this.toturi.honor();
            this.game.checkGameState(true);
            expect(this.toturi.getMilitarySkill()).toBe(10);
            expect(this.berserker.getMilitarySkill()).toBe(3);
            expect(this.whisperer.getMilitarySkill()).toBe(0);
        });
    });
});
