describe('Daidoji Kageyu', function() {
    integration(function() {
        describe('Daidoji Kageyu\'s Ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-kageyu', 'doji-whisperer'],
                        hand: ['way-of-the-crane']
                    },
                    player2: {
                        inPlay: ['hida-guardian'],
                        hand: ['a-new-name', 'fine-katana', 'ornate-fan', 'seal-of-the-dragon']
                    }
                });

                this.kageyu = this.player1.findCardByName('daidoji-kageyu');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
                this.guardian = this.player2.findCardByName('hida-guardian');
                this.newName = this.player2.findCardByName('a-new-name');
                this.katana = this.player2.findCardByName('fine-katana');
                this.fan = this.player2.findCardByName('ornate-fan');
                this.seal = this.player2.findCardByName('seal-of-the-dragon');
            });

            it('should not be usable if your opponent has played no cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kageyu],
                    defenders: [this.guardian]
                });

                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should draw cards equal to the number of cards played by your opponent (1)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kageyu],
                    defenders: [this.guardian]
                });

                this.player2.playAttachment(this.newName, this.guardian);
                let hand = this.player1.player.hand.size();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.player.hand.size()).toBe(hand + 1);
                expect(this.getChatLogs(3)).toContain('player1 uses Daidoji Kageyu to draw 1 card');
            });

            it('should draw cards equal to the number of cards played by your opponent (4)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kageyu],
                    defenders: [this.guardian]
                });

                this.player2.playAttachment(this.newName, this.guardian);
                this.player1.pass();
                this.player2.playAttachment(this.katana, this.guardian);
                this.player1.pass();
                this.player2.playAttachment(this.fan, this.guardian);
                this.player1.pass();
                this.player2.playAttachment(this.seal, this.guardian);

                let hand = this.player1.player.hand.size();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.player.hand.size()).toBe(hand + 4);
                expect(this.getChatLogs(3)).toContain('player1 uses Daidoji Kageyu to draw 4 cards');
            });

            it('should not count cards you play', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kageyu],
                    defenders: [this.guardian]
                });

                this.player2.playAttachment(this.newName, this.guardian);
                this.player1.clickCard(this.wayOfTheCrane);
                this.player1.clickCard(this.kageyu);
                this.player2.playAttachment(this.katana, this.guardian);
                this.player1.pass();
                this.player2.playAttachment(this.fan, this.guardian);
                this.player1.pass();
                this.player2.playAttachment(this.seal, this.guardian);

                let hand = this.player1.player.hand.size();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.player.hand.size()).toBe(hand + 4);
                expect(this.getChatLogs(3)).toContain('player1 uses Daidoji Kageyu to draw 4 cards');
            });

            it('should not be usable in a military conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kageyu],
                    defenders: [this.guardian]
                });

                this.player2.playAttachment(this.newName, this.guardian);
                let hand = this.player1.player.hand.size();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1.player.hand.size()).toBe(hand);
            });

            it('should not be usable if not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer],
                    defenders: [this.guardian]
                });

                this.player2.playAttachment(this.newName, this.guardian);
                let hand = this.player1.player.hand.size();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.player1.player.hand.size()).toBe(hand);
            });
        });

        describe('Daidoji Kageyu\'s (Disguise)', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'brash-samurai'],
                        dynastyDiscard: ['daidoji-kageyu'],
                        fate: 7
                    }
                });

                this.kageyu = this.player1.findCardByName('daidoji-kageyu');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.player1.moveCard(this.kageyu, 'province 1');
            });

            it('should be playable using disguised', function() {
                let fate = this.player1.fate;
                this.player1.clickCard(this.kageyu);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.brash);
                this.player1.clickCard(this.whisperer);
                expect(this.player1.fate).toBe(fate - 2);
                expect(this.kageyu.location).toBe('play area');
                expect(this.whisperer.location).toBe('dynasty discard pile');
            });
        });
    });
});
