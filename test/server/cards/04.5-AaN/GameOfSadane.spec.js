describe('Game Of Sadane', function() {
    integration(function() {
        describe('when a character leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['doji-whisperer'],
                        hand: ['game-of-sadane']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.gameOfSadane = this.player1.findCardByName('game-of-sadane');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.obstinateRecruit]
                });
                this.player2.pass();
                this.player1.clickCard(this.gameOfSadane);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
            });

            it('the winner should still be honored', function() {
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.dojiWhisperer.isHonored).toBeTruthy();
            });
        });

        describe('when used during a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['prodigy-of-the-waves', 'seppun-guardsman', 'solemn-scholar'],
                        hand: ['supernatural-storm']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['savvy-politician', 'doji-whisperer'],
                        hand: ['kakita-blade', 'game-of-sadane']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['prodigy-of-the-waves', 'seppun-guardsman'],
                    defenders: ['savvy-politician']
                });
                this.prodigyOfTheWaves = this.player1.findCardByName('prodigy-of-the-waves');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.savvyPolitician = this.player2.findCardByName('savvy-politician');
            });

            it('should allow targeting of characters without a dash who are participating', function() {
                this.player2.clickCard('game-of-sadane');
                expect(this.player2).toHavePrompt('Game Of Sadane');
                expect(this.player2).not.toBeAbleToSelect('doji-whisperer');
                expect(this.player2).toBeAbleToSelect(this.savvyPolitician);
                this.player2.clickCard(this.savvyPolitician);
                expect(this.player2).toBeAbleToSelect(this.prodigyOfTheWaves);
                expect(this.player2).not.toBeAbleToSelect(this.seppunGuardsman);
                expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            });

            it('should initiate a duel', function() {
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.player1).toHavePrompt('Honor Bid');
                expect(this.player2).toHavePrompt('Honor Bid');
            });

            it('should activate duel buffs', function() {
                this.kakitaBlade = this.player2.playAttachment('kakita-blade', this.savvyPolitician);
                this.player1.pass();
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                expect(this.savvyPolitician.politicalSkill).toBe(4);
            });

            it('should trade honor', function() {
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.player1.player.honor).toBe(13);
                expect(this.player2.player.honor).toBe(9);
            });

            it('should honor the winner and dishonor the loser', function() {
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.savvyPolitician.isHonored).toBe(true);
                expect(this.prodigyOfTheWaves.isDishonored).toBe(true);
            });

            it('should correctly trigger and resolve on duel won abilities', function() {
                this.kakitaBlade = this.player2.playAttachment('kakita-blade', this.savvyPolitician);
                this.player1.pass();
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.kakitaBlade);
                this.player2.clickCard(this.kakitaBlade);
                expect(this.player2.honor).toBe(10);
            });

            it('should do nothing if the duel is a tie', function() {
                this.player2.clickCard('game-of-sadane');
                this.player2.clickCard(this.savvyPolitician);
                this.player2.clickCard(this.prodigyOfTheWaves);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('3');
                expect(this.savvyPolitician.isHonored).toBe(false);
                expect(this.savvyPolitician.isDishonored).toBe(false);
                expect(this.prodigyOfTheWaves.isHonored).toBe(false);
                expect(this.prodigyOfTheWaves.isDishonored).toBe(false);
            });
        });
    });
});
