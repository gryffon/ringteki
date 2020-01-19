describe('An Ocean In A Drop', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja', 'brash-samurai'],
                    hand: ['an-ocean-in-a-drop', 'way-of-the-scorpion', 'way-of-the-crane', 'way-of-the-dragon'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'duty', 'assassination']
                },
                player2: {
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'way-of-the-dragon'],
                    conflictDeck: ['fine-katana', 'ornate-fan', 'duty', 'assassination'],
                    dynastyDiscard: ['hantei-xxxviii']
                }
            });

            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.ocean = this.player1.findCardByName('an-ocean-in-a-drop');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.dragon = this.player1.findCardByName('way-of-the-dragon');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.duty = this.player1.findCardByName('duty');
            this.assassination = this.player1.findCardByName('assassination');

            this.scorpion2 = this.player2.findCardByName('way-of-the-scorpion');
            this.crane2 = this.player2.findCardByName('way-of-the-crane');
            this.dragon2 = this.player2.findCardByName('way-of-the-dragon');
            this.katana2 = this.player2.findCardByName('fine-katana');
            this.fan2 = this.player2.findCardByName('ornate-fan');
            this.duty2 = this.player2.findCardByName('duty');
            this.assassination2 = this.player2.findCardByName('assassination');

            this.hantei = this.player2.findCardByName('hantei-xxxviii');

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.player2.reduceDeckToNumber('conflict deck', 0);

            this.player1.moveCard(this.assassination, 'conflict deck');
            this.player1.moveCard(this.duty, 'conflict deck');
            this.player1.moveCard(this.fan, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');

            this.player2.moveCard(this.assassination2, 'conflict deck');
            this.player2.moveCard(this.duty2, 'conflict deck');
            this.player2.moveCard(this.fan2, 'conflict deck');
            this.player2.moveCard(this.katana2, 'conflict deck');

            this.player1.playAttachment(this.ocean, this.doomed);
        });

        it('should not be usable out of conflict', function() {
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be usable while not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow selecting either player', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
        });

        it('should not allow selecting a player with no hand', function() {
            this.player2.moveCard(this.crane2, 'conflict discard pile');
            this.player2.moveCard(this.scorpion2, 'conflict discard pile');
            this.player2.moveCard(this.dragon2, 'conflict discard pile');
            expect(this.player2.hand.length).toBe(0);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).not.toHavePromptButton('player2');
        });

        it('should not allow using if neither player have any cards', function() {
            this.player1.moveCard(this.crane, 'conflict discard pile');
            this.player1.moveCard(this.scorpion, 'conflict discard pile');
            this.player1.moveCard(this.dragon, 'conflict discard pile');
            expect(this.player1.hand.length).toBe(0);

            this.player2.moveCard(this.crane2, 'conflict discard pile');
            this.player2.moveCard(this.scorpion2, 'conflict discard pile');
            this.player2.moveCard(this.dragon2, 'conflict discard pile');
            expect(this.player2.hand.length).toBe(0);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should put the players hand on the bottom of their deck and draw an equal number of cards (self)', function() {
            let hand = this.player1.hand.length;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();

            expect(this.katana.location).toBe('conflict deck');
            expect(this.fan.location).toBe('conflict deck');
            expect(this.duty.location).toBe('conflict deck');
            expect(this.assassination.location).toBe('conflict deck');

            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
            this.player1.clickPrompt('player1');
            expect(this.scorpion.location).toBe('conflict deck');
            expect(this.crane.location).toBe('conflict deck');
            expect(this.dragon.location).toBe('conflict deck');
            expect(this.katana.location).toBe('hand');
            expect(this.fan.location).toBe('hand');
            expect(this.duty.location).toBe('hand');
            expect(this.assassination.location).toBe('conflict deck');
            expect(this.player1.hand.length).toBe(hand);
            expect(this.getChatLogs(3)).toContain('player1 uses An Ocean in a Drop, sacrificing An Ocean in a Drop to place player1\'s hand on the bottom of their deck and have them draw 3 cards');
        });

        it('should put the players hand on the bottom of their deck and draw an equal number of cards (opponent)', function() {
            let hand = this.player2.hand.length;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();

            expect(this.katana.location).toBe('conflict deck');
            expect(this.fan.location).toBe('conflict deck');
            expect(this.duty.location).toBe('conflict deck');
            expect(this.assassination.location).toBe('conflict deck');

            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
            this.player1.clickPrompt('player2');
            expect(this.scorpion2.location).toBe('conflict deck');
            expect(this.crane2.location).toBe('conflict deck');
            expect(this.dragon2.location).toBe('conflict deck');
            expect(this.katana2.location).toBe('hand');
            expect(this.fan2.location).toBe('hand');
            expect(this.duty2.location).toBe('hand');
            expect(this.assassination2.location).toBe('conflict deck');
            expect(this.player2.hand.length).toBe(hand);
            expect(this.getChatLogs(3)).toContain('player1 uses An Ocean in a Drop, sacrificing An Ocean in a Drop to place player2\'s hand on the bottom of their deck and have them draw 3 cards');
        });

        it('should allow using Hantei to pick the player', function() {
            let hand = this.player1.hand.length;

            this.player2.moveCard(this.hantei, 'play area');
            expect(this.hantei.location).toBe('play area');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.ocean);
            this.player1.clickPrompt('player2');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.hantei);
            this.player2.clickCard(this.hantei);
            expect(this.player2).toHavePromptButton('player1');
            expect(this.player2).toHavePromptButton('player2');

            expect(this.katana.location).toBe('conflict deck');
            expect(this.fan.location).toBe('conflict deck');
            expect(this.duty.location).toBe('conflict deck');
            expect(this.assassination.location).toBe('conflict deck');

            this.player2.clickPrompt('player1');

            expect(this.scorpion.location).toBe('conflict deck');
            expect(this.crane.location).toBe('conflict deck');
            expect(this.dragon.location).toBe('conflict deck');
            expect(this.katana.location).toBe('hand');
            expect(this.fan.location).toBe('hand');
            expect(this.duty.location).toBe('hand');
            expect(this.assassination.location).toBe('conflict deck');
            expect(this.player1.hand.length).toBe(hand);
            expect(this.getChatLogs(3)).toContain('player1 uses An Ocean in a Drop, sacrificing An Ocean in a Drop to place player1\'s hand on the bottom of their deck and have them draw 3 cards');
        });

        it('should not die if you deck yourself', function() {
            let hand = this.player1.hand.length;

            this.player1.reduceDeckToNumber('conflict deck', 0);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.doomed],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();

            this.player1.clickCard(this.ocean);
            expect(this.player1).toHavePromptButton('player1');
            expect(this.player1).toHavePromptButton('player2');
            this.player1.clickPrompt('player1');
            expect(this.scorpion.location).toBe('hand');
            expect(this.crane.location).toBe('hand');
            expect(this.dragon.location).toBe('hand');
            expect(this.player1.hand.length).toBe(hand);
            expect(this.getChatLogs(3)).toContain('player1 uses An Ocean in a Drop, sacrificing An Ocean in a Drop to place player1\'s hand on the bottom of their deck and have them draw 3 cards');
        });
    });
});
