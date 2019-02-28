describe('Iaijutsu Master', function() {
    integration(function() {
        describe('During the draw phase,', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'regroup',
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

                this.player1.pass();
                this.iaijutsu = this.player2.playAttachment('iaijutsu-master', this.challenger);
                this.noMoreActions(); // regroup phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
                this.noMoreActions(); // dynasty phase
            });

            it('should not trigger', function() {
                expect(this.challenger.attachments.toArray()).toContain(this.iaijutsu);
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.iaijutsu);
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('Iaijutsu Master\'s ability, if previous duel canceled with Stay Your Hand,', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['mirumoto-raitsugu'],
                        hand: ['challenge-on-the-fields']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doji-challenger', 'doji-whisperer'],
                        hand: ['iaijutsu-master', 'stay-your-hand']
                    }
                });
                this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.challengeOnTheFields = this.player1.findCardByName('challenge-on-the-fields');

                this.dojiChallenger = this.player2.findCardByName('doji-challenger');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.iaijutsuMaster = this.player2.findCardByName('iaijutsu-master');
                this.stayYourHand = this.player2.findCardByName('stay-your-hand');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoRaitsugu],
                    defenders: [this.dojiChallenger, this.dojiWhisperer]
                });
            });

            it('should not count as being part of the next duel', function() {
                this.player2.playAttachment(this.iaijutsuMaster, this.dojiChallenger);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.stayYourHand);
                this.player2.clickCard(this.stayYourHand);
                expect(this.game.currentDuel).toBe(null);
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                expect(this.player1).toHavePrompt('Challenge on the Fields');
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('2');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.iaijutsuMaster);
                expect(this.player2).toHavePrompt('Conflict Action Window');
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
