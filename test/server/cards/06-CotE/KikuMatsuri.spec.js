describe('Kiku Matsuri', function() {
    integration(function() {
        describe('Kiku Matsuri\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'kakita-yoshi', 'kakita-kaezin']
                    },
                    player2: {
                        inPlay: ['prodigy-of-the-waves'],
                        provinces: ['kiku-matsuri']
                    }
                });
                this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.hotaru.dishonor();
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.kaezin = this.player1.findCardByName('kakita-kaezin');
                this.kaezin.honor();
                this.kikuMatsuri = this.player2.findCardByName('kiku-matsuri');
                this.prodigy = this.player2.findCardByName('prodigy-of-the-waves');
                this.noMoreActions();
            });

            describe('When selecting target characters', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        province: this.kikuMatsuri,
                        attackers: [this.hotaru, this.yoshi, this.kaezin],
                        defenders: [this.prodigy]
                    });
                    this.player2.clickCard(this.kikuMatsuri);
                });

                it('should not be allowed to target two of opponent\'s characters', function() {
                    expect(this.player2).toHavePrompt('Kiku Matsuri');
                    this.player2.clickCard(this.hotaru);
                    expect(this.player2).not.toBeAbleToSelect(this.yoshi);
                    expect(this.player2).toBeAbleToSelect(this.prodigy);
                });

                it('should not be allowed to target honored characters', function() {
                    expect(this.player2).toHavePrompt('Kiku Matsuri');
                    this.player2.clickCard(this.prodigy);
                    expect(this.player2).not.toBeAbleToSelect(this.kaezin);
                    expect(this.player2).toBeAbleToSelect(this.yoshi);
                });

                it('should honor character starting in a normal state', function() {
                    expect(this.player2).toHavePrompt('Kiku Matsuri');
                    this.player2.clickCard(this.prodigy);
                    this.player2.clickCard(this.yoshi);
                    expect(this.prodigy.isHonored).toBe(true);
                    expect(this.yoshi.isHonored).toBe(true);
                });

                it('should be allowed to target ordinary and dishonored charcters', function() {
                    expect(this.player2).toHavePrompt('Kiku Matsuri');
                    this.player2.clickCard(this.prodigy);
                    this.player2.clickCard(this.hotaru);
                    expect(this.prodigy.isHonored).toBe(true);
                    expect(this.hotaru.isHonored).toBe(false);
                    expect(this.hotaru.isDishonored).toBe(false);
                });
            });

            describe('When there are no defenders', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        province: this.kikuMatsuri,
                        attackers: [this.hotaru, this.yoshi, this.kaezin],
                        defenders: []
                    });
                    this.player2.clickCard(this.kikuMatsuri);
                });

                it('should not be able to be used', function() {
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
