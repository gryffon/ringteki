describe('Matsu Koso', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-koso', 'matsu-berserker', 'kitsu-motso']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'shiba-tsukune', 'isawa-uona'],
                    hand: ['my-ancestor-s-strength'],
                    dynastyDiscard: ['fushicho']
                }
            });

            this.kitsuMotso = this.player1.findCardByName('kitsu-motso');
            this.matsuKoso = this.player1.findCardByName('matsu-koso');
            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
            this.isawaUona = this.player2.findCardByName('isawa-uona');
            this.fushicho = this.player2.findCardByName('fushicho');
            this.myAncestorsStrength = this.player2.findCardByName('my-ancestor-s-strength');
        });

        it('should decrease each participating characters military skill by their printed base political skill on both sides (Koso attacking)', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kitsuMotso, this.matsuKoso, this.matsuBerserker],
                defenders: [this.solemnScholar, this.shibaTsukune, this.isawaUona],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.matsuKoso);

            expect(this.matsuKoso.getMilitarySkill()).toBe(this.matsuKoso.printedMilitarySkill); // Printed pol is NaN
            expect(this.kitsuMotso.getMilitarySkill()).toBe(this.kitsuMotso.printedMilitarySkill - this.kitsuMotso.printedPoliticalSkill);
            expect(this.matsuBerserker.getMilitarySkill()).toBe(this.matsuBerserker.printedMilitarySkill); // Printed pol is NaN
            expect(this.solemnScholar.getMilitarySkill()).toBe(this.solemnScholar.printedMilitarySkill - this.solemnScholar.printedPoliticalSkill);
            expect(this.shibaTsukune.getMilitarySkill()).toBe(this.shibaTsukune.printedMilitarySkill - this.shibaTsukune.printedPoliticalSkill);
            expect(this.isawaUona.getMilitarySkill()).toBe(this.isawaUona.printedMilitarySkill); // Printed pol is NaN
            expect(this.getChatLogs(5)).toContain('player1 uses Matsu Koso to lower the military skill of Kitsu Motso, Matsu Koso, Matsu Berserker, Solemn Scholar, Shiba Tsukune and Isawa Uona by their respective pirnted political skill');
        });

        it('should decrease each participating characters military skill by their printed base political skill on both sides (Koso defending)', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();


            this.initiateConflict({
                defenders: [this.kitsuMotso, this.matsuKoso, this.matsuBerserker],
                attackers: [this.solemnScholar, this.shibaTsukune, this.isawaUona],
                type: 'military'
            });

            this.player1.clickCard(this.matsuKoso);

            expect(this.matsuKoso.getMilitarySkill()).toBe(this.matsuKoso.printedMilitarySkill); // Printed pol is NaN
            expect(this.kitsuMotso.getMilitarySkill()).toBe(this.kitsuMotso.printedMilitarySkill - this.kitsuMotso.printedPoliticalSkill);
            expect(this.matsuBerserker.getMilitarySkill()).toBe(this.matsuBerserker.printedMilitarySkill); // Printed pol is NaN
            expect(this.solemnScholar.getMilitarySkill()).toBe(this.solemnScholar.printedMilitarySkill - this.solemnScholar.printedPoliticalSkill);
            expect(this.shibaTsukune.getMilitarySkill()).toBe(this.shibaTsukune.printedMilitarySkill - this.shibaTsukune.printedPoliticalSkill);
            expect(this.isawaUona.getMilitarySkill()).toBe(this.isawaUona.printedMilitarySkill); // Printed pol is NaN
            expect(this.getChatLogs(5)).toContain('player1 uses Matsu Koso to lower the military skill of Solemn Scholar, Shiba Tsukune, Isawa Uona, Kitsu Motso, Matsu Koso and Matsu Berserker by their respective pirnted political skill');
        });

        it('should take into account printed, not base political', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.matsuKoso],
                defenders: [this.solemnScholar],
                type: 'military'
            });

            this.player2.clickCard(this.myAncestorsStrength);
            this.player2.clickCard(this.solemnScholar);
            this.player2.clickCard(this.fushicho);
            expect(this.solemnScholar.getMilitarySkill()).toBe(this.fushicho.printedMilitarySkill); // Base Fushicho
            this.player1.clickCard(this.matsuKoso);

            expect(this.matsuKoso.getMilitarySkill()).toBe(this.matsuKoso.printedMilitarySkill); // Printed pol is NaN
            expect(this.solemnScholar.getMilitarySkill()).toBe(this.fushicho.printedMilitarySkill - this.solemnScholar.printedPoliticalSkill); // Base Fushicho - printed Solemn Scholar
        });
    });
});
