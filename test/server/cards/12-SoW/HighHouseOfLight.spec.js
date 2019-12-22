describe('High House of Light', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancient-master', 'doji-challenger', 'togashi-mitsu'],
                    hand: ['a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name'],
                    stronghold: 'high-house-of-light'
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'togashi-initiate'],
                    hand: ['way-of-the-scorpion', 'the-stone-of-sorrows']
                }
            });

            this.house = this.player1.findCardByName('high-house-of-light');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');

            this.raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.scorpion = this.player2.findCardByName('way-of-the-scorpion');

            this.game.rings.void.fate = 1;
            this.game.rings.water.fate = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ancientMaster, this.challenger],
                defenders: [this.raitsugu, this.initiate],
                type: 'military'
            });
        });

        it('should allow targeting a participating monk you control', function() {
            this.player2.pass();
            this.player1.clickCard(this.house);
            expect(this.player1).toBeAbleToSelect(this.ancientMaster);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.raitsugu);
            expect(this.player1).not.toBeAbleToSelect(this.initiate);
        });

        it('should prevent your monk from being targeted by an opponents event', function() {
            this.player2.pass();
            this.player1.clickCard(this.house);
            this.player1.clickCard(this.ancientMaster);

            expect(this.getChatLogs(3)).toContain('player1 uses High House of Light, bowing High House of Light to make Ancient Master unable to be targeted by opponent\'s events');

            this.player2.clickCard(this.scorpion);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.raitsugu);
            expect(this.player2).toBeAbleToSelect(this.initiate);
        });

        it('should allow your monk to be targeted by non-event abilities', function() {
            this.player2.pass();
            this.player1.clickCard(this.house);
            this.player1.clickCard(this.ancientMaster);

            this.player2.clickCard(this.raitsugu);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
            expect(this.player2).toBeAbleToSelect(this.challenger);
        });

        it('if you played 5 cards should also allow you to pick a ring with a fate and move it to the monk', function() {
            let i = 0;
            for(i = 0; i < 5; i++) {
                this.player2.pass();
                this.player1.playAttachment(this.player1.filterCardsByName('a-new-name')[i], this.initiate);
            }

            this.player2.pass();
            this.player1.clickCard(this.house);
            this.player1.clickCard(this.ancientMaster);

            let monkFate = this.ancientMaster.fate;
            let ringFate = this.game.rings.void.fate;
            let playerFate = this.player1.fate;

            expect(this.player1).toBeAbleToSelectRing('void');
            expect(this.player1).toBeAbleToSelectRing('water');
            expect(this.player1).not.toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');

            this.player1.clickRing('void');

            expect(this.ancientMaster.fate).toBe(monkFate + 1);
            expect(this.game.rings.void.fate).toBe(ringFate - 1);
            expect(this.player1.fate).toBe(playerFate);

            expect(this.getChatLogs(4)).toContain('player1 uses High House of Light, bowing High House of Light to make Ancient Master unable to be targeted by opponent\'s events');
            expect(this.getChatLogs(3)).toContain('player1 moves a fate from the Void Ring to Ancient Master');
        });

        it('Stone of Sorrows should prevent you from taking the fate', function() {
            let i = 0;
            for(i = 0; i < 5; i++) {
                this.player2.pass();
                this.player1.playAttachment(this.player1.filterCardsByName('a-new-name')[i], this.initiate);
            }

            this.player2.playAttachment('the-stone-of-sorrows', this.raitsugu);
            this.player1.clickCard(this.house);
            this.player1.clickCard(this.ancientMaster);

            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.getChatLogs(3)).toContain('player1 uses High House of Light, bowing High House of Light to make Ancient Master unable to be targeted by opponent\'s events');
        });
    });
});
