describe('Adopted Kin', function() {
    integration(function() {
        describe('Adopted Kin\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['niten-adept'],
                        hand: ['adopted-kin', 'fine-katana', 'ancient-master']
                    },
                    player2: {
                        hand: ['assassination', 'let-go']
                    }
                });
                this.adept = this.player1.findCardByName('niten-adept');
                this.katana = this.player1.findCardByName('fine-katana');
                this.master = this.player1.findCardByName('ancient-master');
                this.kin = this.player1.findCardByName('adopted-kin');
                this.assassination = this.player2.findCardByName('assassination');
                this.letGo = this.player2.findCardByName('let-go');

                this.player1.playAttachment(this.katana, this.adept);
                this.player2.pass();
                this.player1.playAttachment(this.kin, this.adept);
                this.player2.pass();
                this.player1.clickCard(this.master);
                this.player1.clickPrompt('Play Ancient Master as an attachment');
                this.player1.clickCard(this.adept);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adept],
                });
                this.player1.pass();
                this.player2.clickPrompt('Done');
            });

            it('should give every other attachment the "ancestral"-keyword', function() {
                expect(this.katana.hasKeyword('ancestral')).toBe(true);
                expect(this.master.hasKeyword('ancestral')).toBe(true);
                expect(this.kin.hasKeyword('ancestral')).toBe(false);
            });

            it('should return other attachments to hand when attached character is discarded', function() {
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.adept);
                expect(this.player1.player.hand.size()).toBe(2);
                expect(this.player1.player.hand).toContain(this.katana);
                expect(this.player1.player.hand).toContain(this.master);
            });

            it('should make every other attachment lose the "ancestral"-keyword if removed from character', function() {
                this.player2.clickCard(this.letGo);
                this.player2.clickCard(this.kin);
                expect(this.katana.hasKeyword('ancestral')).toBe(false);
                expect(this.master.hasKeyword('ancestral')).toBe(false);
            });
        });
    });
});
