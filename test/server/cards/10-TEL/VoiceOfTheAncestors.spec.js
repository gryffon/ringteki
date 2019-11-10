describe('Voice of the Ancestors', function() {
    integration(function() {
        describe('Voice of the Ancestors\' ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 4,
                        inPlay: ['voice-of-the-ancestors', 'voice-of-the-ancestors', 'akodo-toturi'],
                        dynastyDiscard: ['ashigaru-levy', 'ashigaru-levy', 'kitsu-spiritcaller', 'matsu-berserker']
                    }
                });

                this.voiceOfTheAncestors = this.player1.filterCardsByName('voice-of-the-ancestors')[0];
                this.voiceOfTheAncestors2 = this.player1.filterCardsByName('voice-of-the-ancestors')[1];
                this.ashigaruLevy = this.player1.findCardByName('ashigaru-levy', 'dynasty discard pile');
                this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            });

            it('should play a character from dynasty discard as an attachment', function () {
                this.player1.clickCard(this.voiceOfTheAncestors);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors2);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy);
                expect(this.player1).toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.matsuBerserker.type).toBe('attachment');
                expect(this.matsuBerserker.location).toBe('play area');
                expect(this.akodoToturi.attachments.toArray()).toContain(this.matsuBerserker);
                expect(this.matsuBerserker.hasTrait('bushi')).toBe(false);
                expect(this.matsuBerserker.hasTrait('spirit')).toBe(true);
                expect(this.player1.fate).toBe(4);
                expect(this.akodoToturi.militarySkill).toBe(9);
            });

            it('should play a character as a spirit, discarding other attached spirits', function() {
                this.player1.clickCard(this.voiceOfTheAncestors);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors2);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy);
                expect(this.player1).toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player2).toHavePrompt('Action Window');

                this.player2.pass();

                this.player1.clickCard(this.voiceOfTheAncestors2);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors);
                expect(this.player1).toBeAbleToSelect(this.voiceOfTheAncestors2);
                this.player1.clickCard(this.akodoToturi);
                expect(this.player1).toHavePrompt('Voice of the Ancestors');
                expect(this.player1).toBeAbleToSelect(this.ashigaruLevy);
                expect(this.player1).toBeAbleToSelect(this.kitsuSpiritcaller);
                this.player1.clickCard(this.ashigaruLevy);

                expect(this.player2).toHavePrompt('Action Window');
                expect(this.matsuBerserker.type).toBe('character');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.akodoToturi.attachments.toArray()).toContain(this.ashigaruLevy);
                expect(this.matsuBerserker.hasTrait('bushi')).toBe(true);
                expect(this.matsuBerserker.hasTrait('spirit')).toBe(false);
                expect(this.ashigaruLevy.type).toBe('attachment');
                expect(this.ashigaruLevy.location).toBe('play area');
                expect(this.ashigaruLevy.hasTrait('peasant')).toBe(false);
                expect(this.ashigaruLevy.hasTrait('spirit')).toBe(true);

                expect(this.player1.fate).toBe(4);
                expect(this.akodoToturi.militarySkill).toBe(7);
            });
        });
    });
});
