describe('Civil Discourse', function() {
    integration(function() {
        describe('Civil Discours\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['civil-discourse', 'banzai']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith', 'togashi-mitsu'],
                        hand: ['fine-katana', 'tattooed-wanderer']
                    }
                });
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.civilDiscourse = this.player1.findCardByName('civil-discourse');
                this.banzai = this.player1.findCardByName('banzai');

                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.togashiMitsu = this.player2.findCardByName('togashi-mitsu');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.civilDiscourse);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to select a participating character on your side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.agashaSwordsmith],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.civilDiscourse);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).not.toBeAbleToSelect(this.togashiMitsu);
            });

            it('should prompt your opponent to select a participating character on their side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.agashaSwordsmith],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.civilDiscourse);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player2).not.toBeAbleToSelect(this.togashiMitsu);
            });

            it('should initiate a political duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.agashaSwordsmith],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.civilDiscourse);
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(4)).toContain('Doji Challenger: 4 vs 3: Agasha Swordsmith');
            });

            it('should give the loser the constant ability \'Increase the cost to play each card in your hand by 1.\'', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger],
                    defenders: [this.agashaSwordsmith],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.civilDiscourse);
                this.player1.clickCard(this.dojiChallenger);
                this.player2.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                let player2fate = this.player2.player.fate;
                this.player2.clickCard(this.fineKatana);
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2.player.fate).toBe(player2fate - 1);
                let player1fate = this.player1.player.fate;
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickPrompt('Done');
                expect(this.player1.player.fate).toBe(player1fate);
                player2fate = this.player2.player.fate;
                this.player2.clickCard(this.tattooedWanderer);
                this.player2.clickPrompt('Play this character');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.player2.player.fate).toBe(player2fate - 2);
            });
        });
    });
});
