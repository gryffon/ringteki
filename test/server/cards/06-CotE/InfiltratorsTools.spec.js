describe('Infiltrator\'s Tools', function() {
    integration(function() {
        describe('Infiltrator\'s Tools\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alibi-artist', 'young-rumormonger'],
                        hand: ['infiltrator-s-tools']
                    },
                    player2: {
                        inPlay: ['togashi-mitsu', 'niten-master']
                    }
                });
                this.alibiArtist = this.player1.findCardByName('alibi-artist');
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                this.togashiMitsu = this.player2.findCardByName('togashi-mitsu');
                this.nitenMaster = this.player2.findCardByName('niten-master');
            });

            it('shouldn\'t be playable on non-shinobi characters', function() {
                this.player1.clickCard('infiltrator-s-tools');
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).not.toBeAbleToSelect(this.youngRumormonger);
            });

            it('should grant covert', function() {
                this.infiltratorsTools = this.player1.playAttachment('infiltrator-s-tools', this.alibiArtist);
                expect(this.alibiArtist.hasKeyword('covert')).toBe(true);
            });
        });
    });
});
