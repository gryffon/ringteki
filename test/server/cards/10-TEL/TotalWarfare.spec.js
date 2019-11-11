describe('Total Warfare', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-zentaro', 'matsu-berserker'],
                    hand: ['total-warfare','total-warfare']
                },
                player2: {
                    inPlay: ['samurai-of-integrity', 'akodo-toturi'],
                    provinces: ['ancestral-lands']
                }
            });

            this.zentaro = this.player1.findCardByName('akodo-zentaro');
            this.matsuBerseker = this.player1.findCardByName('matsu-berserker');
            this.totalWarfare = this.player1.filterCardsByName('total-warfare')[0];
            this.totalWarfare2 = this.player1.filterCardsByName('total-warfare')[1];

            this.samuraiOfIntegrity = this.player2.findCardByName('samurai-of-integrity');
            this.akodoToturi = this.player2.findCardByName('akodo-toturi');
            this.ancestralLands = this.player2.findCardByName('ancestral-lands');
        });

        it('should be able to played on a province', function() {
            this.player1.playAttachment(this.totalWarfare, this.ancestralLands);

            expect(this.totalWarfare.parent).toBe(this.ancestralLands);
        });

        it('should prompt the loser to sacrifice a character', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.zentaro, this.matsuBerseker],
                defenders: [this.akodoToturi, this.samuraiOfIntegrity],
                province: this.ancestralLands
            });

            this.player2.pass();
            this.player1.playAttachment(this.totalWarfare, this.ancestralLands);

            this.player2.pass();
            this.player1.pass();

            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.zentaro);
            expect(this.zentaro.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(3)).toContain('player1 uses Total Warfare to sacrifice Akodo Zentarō');
        });

        it('should prompt the loser to sacrifice a character, regardless of controller', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.zentaro, this.matsuBerseker],
                defenders: [this.samuraiOfIntegrity],
                province: this.ancestralLands
            });

            this.player2.pass();
            this.player1.playAttachment(this.totalWarfare, this.ancestralLands);

            this.player2.pass();
            this.player1.pass();

            expect(this.player2).toHavePrompt('Choose a character');
            this.player2.clickCard(this.samuraiOfIntegrity);
            expect(this.samuraiOfIntegrity.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(3)).toContain('player1 uses Total Warfare to sacrifice Samurai of Integrity');
        });

        it('shouldn\'t be able to have two battlefields at the same time', function() {
            this.player1.playAttachment(this.totalWarfare, this.ancestralLands);

            expect(this.totalWarfare.parent).toBe(this.ancestralLands);
            this.player2.pass();
            expect(this.totalWarfare2.location).toBe('hand');
            this.player1.playAttachment(this.totalWarfare2, this.ancestralLands);

            expect(this.totalWarfare.parent).toBe(null);
            expect(this.totalWarfare.location).toBe('conflict discard pile');
            expect(this.totalWarfare2.parent).toBe(this.ancestralLands);
            expect(this.totalWarfare2.location).toBe('play area');
        });
    });
});
