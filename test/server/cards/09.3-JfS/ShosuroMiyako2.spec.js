describe('Shosuro Miyako 2', function() {
    integration(function() {
        describe('Shosuro Miyako 2\'s \'can only be played\' effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['shosuro-miyako-2']
                    }
                });

                this.shosuroMiyako = this.player1.findCardByName('shosuro-miyako-2');
            });

            it('should not be able to be played without the disguised keyword', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.shosuroMiyako);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Shosuro Miyako 2\'s \'disguised\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alibi-artist', 'doji-whisperer', 'doji-hotaru'],
                        hand: ['shosuro-miyako-2']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves']
                    }
                });

                this.shosuroMiyako = this.player1.findCardByName('shosuro-miyako-2');
                this.alibiArtist = this.player1.findCardByName('alibi-artist');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
            });

            it('should be able to disguise over a non-scorpion non-unique character only', function() {
                this.player1.clickCard(this.shosuroMiyako);
                expect(this.player1).toHavePrompt('Choose a character to replace');
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
                expect(this.player1).not.toBeAbleToSelect(this.adeptOfTheWaves);
            });
        });

        describe('Shosuro Miyako 2\'s \'reaction\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['alibi-artist', 'doji-whisperer', 'doji-hotaru'],
                        hand: ['shosuro-miyako-2']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves', 'isawa-tadaka']
                    }
                });

                this.shosuroMiyako = this.player1.findCardByName('shosuro-miyako-2');
                this.alibiArtist = this.player1.findCardByName('alibi-artist');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');

                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.isawaTadaka = this.player2.findCardByName('isawa-tadaka');
            });

            it('should trigger when Shosuro Miyako enters play', function() {
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shosuroMiyako);
            });

            it('should prompt to choose a non-unique character your opponent controls', function() {
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickPrompt('Shosuro Miyako being played'); // shouldn't need to be here
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiHotaru);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).not.toBeAbleToSelect(this.isawaTadaka);
            });

            it('should dishonor the chosen character', function() {
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickCard(this.dojiWhisperer);
                this.player1.clickCard(this.shosuroMiyako);
                this.player1.clickPrompt('Shosuro Miyako being played'); // shouldn't need to be here
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.isDishonored).toBe(true);
                expect(this.getChatLogs(1)).toContain('player1 uses Shosuro Miyako to dishonor Adept of the Waves');
            });
        });
    });
});
