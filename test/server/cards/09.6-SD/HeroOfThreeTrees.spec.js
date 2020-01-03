describe('Hero Of Three Trees', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hero-of-three-trees'],
                    hand: ['jewel-of-the-khamasin']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['assassination']
                }
            });

            this.hero = this.player1.findCardByName('hero-of-three-trees');
            this.jewel = this.player1.findCardByName('jewel-of-the-khamasin');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');

            this.p1Shameful = this.player1.findCardByName('shameful-display', 'province 1');
            this.p2Shameful = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2Shameful2 = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('should not trigger when you have the same amount or more cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should trigger when you have less cards', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
        });

        it('Option 1: Gain an honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: []
            });

            let honor = this.player1.honor;

            this.player2.pass();
            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');

            this.player1.clickPrompt('Gain 1 honor');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.getChatLogs(3)).toContain('player1 uses Hero of Three Trees to gain 1 honor');
        });

        it('Option 2: Lower attacked province\'s strength by 1', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: [],
                province: this.p2Shameful
            });

            let strength = this.p2Shameful.strength;

            this.player2.pass();
            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
            this.player1.clickPrompt('Lower attacked province\'s strength by 1');

            expect(this.p2Shameful.strength).toBe(strength - 1);
            expect(this.p2Shameful2.strength).toBe(strength);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(3)).toContain('player1 uses Hero of Three Trees to reduce the strength of Shameful Display by 1');
        });

        it('Option 2: Should be be selectable if the province strength is already 0', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: [],
                province: this.p2Shameful
            });

            this.player2.pass();
            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);
            this.player2.pass();

            while(this.p2Shameful.strength > 0) {
                this.player1.clickCard(this.jewel);
                this.player2.pass();
            }

            let honor = this.player1.honor;

            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).not.toHavePromptButton('Lower attacked province\'s strength by 1');
            this.player1.clickPrompt('Gain 1 honor');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('Option 2: Reduce the province strength should end after the conflict is over', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hero],
                defenders: [],
                province: this.p2Shameful
            });

            let strength = this.p2Shameful.strength;

            this.player2.pass();
            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
            this.player1.clickPrompt('Lower attacked province\'s strength by 1');

            expect(this.p2Shameful.strength).toBe(strength - 1);
            expect(this.p2Shameful2.strength).toBe(strength);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.hero.bowed = true;
            this.player2.pass();
            this.player1.pass();
            expect(this.p2Shameful.strength).toBe(strength);
        });

        it('should trigger on defense as well', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.hero],
                province: this.p1Shameful
            });

            let strength = this.p1Shameful.strength;

            this.player1.clickCard(this.jewel);
            this.player1.clickCard(this.hero);

            this.player2.pass();
            this.player1.clickCard(this.hero);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Gain 1 honor');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
            this.player1.clickPrompt('Lower attacked province\'s strength by 1');

            expect(this.p1Shameful.strength).toBe(strength - 1);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
