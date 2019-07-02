describe('Shameless Gossip', function() {
    integration(function() {
        describe('Shameless Gossip\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shameless-gossip', 'alibi-artist', 'bayushi-liar']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'doji-hotaru']
                    }
                });

                this.shamelessGossip = this.player1.findCardByName('shameless-gossip');
                this.shamelessGossip.dishonor();
                this.alibiArtist = this.player1.findCardByName('alibi-artist');
                this.alibiArtist.dishonor();
                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.dojiWhisperer.dishonor();
                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.dojiHotaru.honor();
            });

            it('should not be triggerable if not participating', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.shamelessGossip);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.alibiArtist],
                    defenders: [this.dojiWhisperer],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.shamelessGossip);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose any character with a personal honor token', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shamelessGossip],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shamelessGossip);
                expect(this.player1).toHavePrompt('Choose a Character to move a status token from');
                expect(this.player1).toBeAbleToSelect(this.shamelessGossip);
                expect(this.player1).toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
            });

            it('should prompt to choose a second character controlled by the same player (without the same honor status) (controller)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shamelessGossip],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shamelessGossip);
                this.player1.clickCard(this.alibiArtist);
                expect(this.player1).toHavePrompt('Choose a Character to move the status token to');
                expect(this.player1).not.toBeAbleToSelect(this.shamelessGossip);
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
            });

            it('should prompt to choose a second character controlled by the same player (without the same honor status) (opponent)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shamelessGossip],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shamelessGossip);
                this.player1.clickCard(this.dojiHotaru);
                expect(this.player1).toHavePrompt('Choose a Character to move the status token to');
                expect(this.player1).not.toBeAbleToSelect(this.shamelessGossip);
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
            });

            it('should move the status token from the first character to the second', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shamelessGossip],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shamelessGossip);
                this.player1.clickCard(this.dojiHotaru);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.isHonored).toBe(false);
                expect(this.dojiWhisperer.isDishonored).toBe(false);
                expect(this.dojiHotaru.isHonored).toBe(false);
                expect(this.dojiHotaru.isDishonored).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Shameless Gossip to move Doji Hotaru\'s Honored Token to Doji Whisperer');
            });
        });
    });
});
