describe('Hitsu-Do Disciple', function() {
    integration(function() {
        describe('Hitsu-Do Disciple\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hitsu-do-disciple', 'doji-whisperer'],
                        hand: ['fine-katana', 'ornate-fan', 'a-new-name']
                    },
                    player2: {
                        inPlay: ['bayushi-liar', 'bayushi-manipulator']
                    }
                });
                this.hitsu = this.player1.findCardByName('hitsu-do-disciple');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.katana = this.player1.findCardByName('fine-katana');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.newName = this.player1.findCardByName('a-new-name');

                this.liar = this.player2.findCardByName('bayushi-liar');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');

                this.noMoreActions();
            });

            it('should not trigger unless the player has played three other cards & should dishonor a participating character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hitsu, this.whisperer],
                    defenders: [this.manipulator]
                });

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.fan);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.newName);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.hitsu);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.manipulator);
                expect(this.player1).not.toBeAbleToSelect(this.liar);

                expect(this.manipulator.isDishonored).toBe(false);
                this.player1.clickCard(this.manipulator);
                expect(this.manipulator.isDishonored).toBe(true);
            });

            it('should not trigger during pol conflicts', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.hitsu, this.whisperer],
                    defenders: [this.manipulator]
                });

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.fan);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.newName);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).not.toHavePrompt('Choose a character');
            });

            it('should not trigger if not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    defenders: [this.manipulator]
                });

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.fan);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.newName);
                this.player1.clickCard(this.hitsu);

                this.player2.pass();
                this.player1.clickCard(this.hitsu);
                expect(this.player1).not.toHavePrompt('Choose a character');
            });
        });
    });
});
