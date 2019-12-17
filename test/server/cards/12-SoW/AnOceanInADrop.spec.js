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
                    conflictDeck: ['fine-katana', 'ornate-fan', 'duty', 'assassination']
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

        it('should put the players hand on the bottom of their deck and draw an equal number of cards', function() {
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
            expect(this.getChatLogs(5)).toContain('hahhh');
        });
    });
});
