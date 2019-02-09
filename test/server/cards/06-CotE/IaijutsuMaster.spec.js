describe('Iaijutsu Master', function() {
    integration(function() {
        describe('During the draw phase,', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 11,
                        inPlay: ['mirumoto-raitsugu']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doji-challenger','doji-whisperer'],
                        hand: ['iaijutsu-master']
                    }
                });
                this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');

                this.challenger = this.player2.findCardByName('doji-challenger');
                this.iaijutsu = this.player2.playAttachment('iaijutsu-master', this.challenger);

            });
            it('should not trigger', function() {
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.iaijutsu);
            });
        });

        describe('During a duel,', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['mirumoto-raitsugu']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doji-challenger','doji-whisperer'],
                        hand: ['iaijutsu-master']
                    }
                });
                this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');

                this.challenger = this.player2.findCardByName('doji-challenger');
                this.iaijutsu = this.player2.findCardByName('iaijutsu-master');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.raitsugu],
                    defenders: [this.challenger]
                });
            });

            it('should not be playable on a non-duelist', function() {
                this.player2.clickCard(this.iaijutsu);
                expect(this.player2).toBeAbleToSelect(this.challenger);
                expect(this.player2).not.toBeAbleToSelect('doji-whisperer');
            });

            it('should trigger after dials are revealed', function() {
                this.player2.playAttachment(this.iaijutsu, this.challenger);
                this.player1.clickCard(this.raitsugu);
                this.player1.clickCard(this.challenger);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('2');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.iaijutsu);
            });

            it('should be able to change dial value to 0', function() {
                this.player2.playAttachment(this.iaijutsu, this.challenger);
                this.player1.clickCard(this.raitsugu);
                this.player1.clickCard(this.challenger);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.clickCard(this.iaijutsu);
                expect(this.player2).toHavePrompt('Select one');
                expect(this.player2.currentButtons).toContain('Increase honor bid','Decrease honor bid');
                this.player2.clickPrompt('Decrease honor bid');
                expect(this.player2.honor).toBe(12);
                expect(this.player1.honor).toBe(10);
            });

            it('should correctly modify the value', function() {
                this.player2.playAttachment(this.iaijutsu, this.challenger);
                this.player1.clickCard(this.raitsugu);
                this.player1.clickCard(this.challenger);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                this.player2.clickCard(this.iaijutsu);
                this.player2.clickPrompt('Increase honor bid');
                expect(this.raitsugu.location).toBe('dynasty discard pile');
                expect(this.player2.honor).toBe(11);
                expect(this.player1.honor).toBe(11);
            });
        });
    });
});
