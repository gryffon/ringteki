describe('Festival for the Fortunes', function() {
    integration(function() {
        describe('Festival for the Fortunes\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                        hand: ['festival-for-the-fortunes']
                    },
                    player2: {
                        inPlay: ['kakita-yoshi']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.festivalForTheFortunes = this.player1.findCardByName('festival-for-the-fortunes');
                this.kakitaYoshi = this.player2.findCardByName('kakita-yoshi');
            });

            it('should honor each character in play', function() {
                this.player1.clickCard(this.festivalForTheFortunes);
                expect(this.matsuBerserker.isHonored).toBe(true);
                expect(this.ikomaProdigy.isHonored).toBe(true);
                expect(this.kakitaYoshi.isHonored).toBe(true);
            });
        });
    });
});
