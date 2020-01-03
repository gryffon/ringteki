describe('Wayfarer\'s Camp', function () {
    integration(function () {
        describe('Wayfarer\'s Camp\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 8,
                        dynastyDiscard: ['wayfarer-s-camp', 'akodo-gunso', 'matsu-berserker', 'seppun-guardsman', 'agasha-taiko']
                    }
                });

                this.wayfarersCamp = this.player1.placeCardInProvince('wayfarer-s-camp');
                this.akodoGunso = this.player1.placeCardInProvince('akodo-gunso', 'province 2');
                this.matsuBerserker = this.player1.placeCardInProvince('matsu-berserker', 'province 3');
                this.seppunGuardsman = this.player1.placeCardInProvince('seppun-guardsman', 'province 4');
                this.agashaTaiko = this.player1.findCardByName('agasha-taiko');
            });

            it('should allow playing 2 cards', function() {
                this.player1.clickCard(this.wayfarersCamp);
                expect(this.player1).toHavePrompt('Choose a character to play');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.matsuBerserker);
                expect(this.player1).toHavePrompt('Choose additional fate');
                this.player1.clickPrompt('1');
                expect(this.matsuBerserker.location).toBe('play area');
                expect(this.matsuBerserker.fate).toBe(1);
                expect(this.player1).toHavePrompt('Choose a character to play');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).not.toBeAbleToSelect(this.matsuBerserker);
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
            });

            it('should prompt to flip a card after playing 2 cards', function() {
                this.player1.clickCard(this.wayfarersCamp);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('1');
                this.player1.clickCard(this.seppunGuardsman);
                this.player1.clickPrompt('0');
                expect(this.seppunGuardsman.location).toBe('play area');
                expect(this.seppunGuardsman.fate).toBe(0);
                expect(this.player1).toHavePrompt('Choose a card to turn faceup');
                this.province3Card = this.player1.player.getDynastyCardInProvince('province 3');
                this.province4Card = this.player1.player.getDynastyCardInProvince('province 4');
                expect(this.player1).toBeAbleToSelect(this.province3Card);
                expect(this.player1).toBeAbleToSelect(this.province4Card);
                this.player1.clickCard(this.province4Card);
                expect(this.province4Card.facedown).toBe(false);
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });

            it('should prompt to flip a card if only 1 card is played', function() {
                this.akodoGunso.facedown = true;
                this.seppunGuardsman.facedown = true;
                this.player1.clickCard(this.wayfarersCamp);
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('1');
                expect(this.matsuBerserker.location).toBe('play area');
                expect(this.matsuBerserker.fate).toBe(1);
                expect(this.player1).toHavePrompt('Choose a card to turn faceup');
            });

            it('should allow Akodo Gunso to react in between plays', function() {
                this.player1.player.moveCard(this.agashaTaiko, 'dynasty deck');
                this.player1.clickCard(this.wayfarersCamp);
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickPrompt('1');
                expect(this.akodoGunso.location).toBe('play area');
                expect(this.akodoGunso.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                this.player1.clickCard(this.akodoGunso);
                expect(this.agashaTaiko.location).toBe('province 2');
                expect(this.agashaTaiko.facedown).toBe(false);
                expect(this.player1).toHavePrompt('Choose a character to play');
                expect(this.player1).toBeAbleToSelect(this.agashaTaiko);
            });

            it('should allow Agasha Taiko to react in between plays', function() {
                this.player1.placeCardInProvince(this.agashaTaiko, 'province 2');
                this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');
                this.player1.clickCard(this.wayfarersCamp);
                this.player1.clickCard(this.agashaTaiko);
                this.player1.clickPrompt('1');
                expect(this.agashaTaiko.location).toBe('play area');
                expect(this.agashaTaiko.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaTaiko);
                this.player1.clickCard(this.agashaTaiko);
                expect(this.player1).toHavePrompt('Agasha Taiko');
                expect(this.player1).toBeAbleToSelect(this.shamefulDisplay);
                this.player1.clickCard(this.shamefulDisplay);
                expect(this.player1).toHavePrompt('Choose a character to play');
            });
        });
    });
});
