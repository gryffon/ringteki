describe('Void Fist', function() {
    integration(function() {
        describe('Void Fist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-mitsu'],
                        hand: ['banzai', 'void-fist', 'fine-katana', 'hurricane-punch'],
                        conflictDiscard: ['centipede-tattoo']
                    },
                    player2: {
                        inPlay: ['bayushi-liar'],
                        dynastyDiscard: ['hidden-moon-dojo', 'seeker-initiate'],
                        hand: ['ornate-fan', 'infiltrator', 'banzai', 'court-games', 'forged-edict']
                    }
                });

                this.courtGames = this.player2.findCardByName('court-games');
                this.forgedEdict = this.player2.findCardByName('forged-edict');

                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
                this.bayushiLiar.dishonor();

                this.hurricanePunch = this.player1.findCardByName('hurricane-punch');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');

                this.player2.placeCardInProvince('hidden-moon-dojo', 'province 1');
                this.seekerInitiate = this.player2.placeCardInProvince('seeker-initiate', 'province 2');
                this.player1.pass();
                this.player2.player.showBid = 5;
                this.infiltrator = this.player2.playAttachment('infiltrator', this.bayushiLiar);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['togashi-mitsu']
                });
                this.player1.clickPrompt('No Target');
                this.player2.clickCard('bayushi-liar');
                this.player2.clickPrompt('Done');
            });

            it('should not trigger unless the player has played two other cards', function() {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger if the player has played 2 cards', function() {
                expect(this.bayushiLiar.inConflict).toBe(true);
                this.player2.playAttachment('ornate-fan', 'bayushi-liar');
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                expect(this.togashiMitsu.militarySkill).toBe(6);
                this.player1.clickPrompt('Done');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('togashi-mitsu');
                this.player1.clickCard('centipede-tattoo');
                expect(this.player1).toHavePrompt('Centipede Tattoo');
                this.player1.clickCard('togashi-mitsu');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.bowed).toBe(true);
                expect(this.bayushiLiar.inConflict).toBe(false);
            });

            it('should trigger if the player has played 2 cards (1 card was canceled, but should count)', function() {
                expect(this.bayushiLiar.inConflict).toBe(true);
                this.player2.playAttachment('ornate-fan', 'bayushi-liar');

                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.togashiMitsu);
                expect(this.togashiMitsu.militarySkill).toBe(6);

                this.player2.clickCard(this.courtGames);
                this.player2.clickPrompt('Honor a friendly character');
                this.player2.clickCard(this.bayushiLiar);

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hurricanePunch);
                this.player1.clickCard(this.togashiMitsu);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.forgedEdict);
                this.player2.clickCard(this.forgedEdict);
                this.player2.clickCard(this.bayushiLiar);

                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.bowed).toBe(true);
                expect(this.bayushiLiar.inConflict).toBe(false);
            });

            it('should not trigger for the opponent if they haven\'t played 2 cards', function() {
                this.player1.moveCard('void-fist', 'conflict deck');
                this.player2.playAttachment('ornate-fan', 'bayushi-liar');
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                expect(this.togashiMitsu.militarySkill).toBe(6);
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.infiltrator);
                expect(this.player2).toHavePrompt('Infiltrator');
                expect(this.player2.currentButtons).toContain('Discard this card');
                expect(this.player2.currentButtons).not.toContain('Play this card');
            });

            it('should trigger for the opponent if they have played 2 cards', function() {
                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');
                this.player1.moveCard('void-fist', 'conflict deck');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.pass();
                this.player2.clickCard('banzai');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player2.clickCard(this.seekerInitiate);
                this.player2.clickPrompt('Done');
                this.player1.pass();
                this.player2.clickCard(this.infiltrator);
                expect(this.player2).toHavePrompt('Infiltrator');
                expect(this.player2.currentButtons).toContain('Discard this card');
                expect(this.player2.currentButtons).toContain('Play this card');
                this.player2.clickPrompt('Play this card');
                expect(this.player2).toHavePrompt('Void Fist');
                this.player2.clickCard(this.togashiMitsu);
                expect(this.togashiMitsu.bowed).toBe(true);
                expect(this.togashiMitsu.inConflict).toBe(false);
            });

            it('should not trigger once the \'card played count\' has reset after the conflict has ended', function () {
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                this.player1.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard('togashi-mitsu');
                this.player1.clickCard('centipede-tattoo');
                this.player1.clickCard('togashi-mitsu');
                this.noMoreActions();
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Initiate an action');
                this.togashiMitsu.bowed = false;
                this.bayushiLiar.bowed = false;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar'],
                    defenders: ['togashi-mitsu'],
                    ring: 'water'
                });
                this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to be played twice (Mitsu second) in the same conflict', function() {
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                this.player1.clickPrompt('Done');
                this.seekerInitiate = this.player2.clickCard('seeker-initiate');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.playAttachment('fine-katana', this.togashiMitsu);
                this.player2.pass();
                this.voidFist = this.player1.clickCard('void-fist');
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.inConflict).toBe(false);
                expect(this.bayushiLiar.bowed).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.togashiMitsu);
                expect(this.player1).toHavePrompt('Togashi Mitsu');
                this.player1.clickCard(this.voidFist);
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.seekerInitiate);
                expect(this.seekerInitiate.inConflict).toBe(false);
                expect(this.seekerInitiate.bowed).toBe(true);
            });

            it('should be able to be played twice (Mitsu first) in the same conflict', function() {
                for(const card of this.player1.player.conflictDeck.toArray()) {
                    this.player1.moveCard(card, 'conflict discard pile');
                }
                this.voidFist = this.player1.findCardByName('void-fist');
                this.player1.moveCard(this.voidFist, 'conflict discard pile');
                this.player2.pass();
                this.player1.clickCard('banzai');
                this.togashiMitsu = this.player1.clickCard('togashi-mitsu');
                this.player1.clickPrompt('Done');
                this.seekerInitiate = this.player2.clickCard('seeker-initiate');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                this.player1.playAttachment('fine-katana', this.togashiMitsu);
                this.player2.pass();
                this.player1.clickCard(this.togashiMitsu);
                expect(this.player1).toHavePrompt('Togashi Mitsu');
                this.player1.clickCard(this.voidFist);
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.inConflict).toBe(false);
                expect(this.bayushiLiar.bowed).toBe(true);
                expect(this.voidFist.location).toBe('conflict deck');
                this.player2.pass();
                this.player1.clickCard('hurricane-punch');
                this.player1.clickCard(this.togashiMitsu);
                expect(this.voidFist.location).toBe('hand');
                this.player2.pass();
                this.player1.clickCard(this.voidFist);
                expect(this.player1).toHavePrompt('Void Fist');
                this.player1.clickCard(this.seekerInitiate);
                expect(this.seekerInitiate.inConflict).toBe(false);
                expect(this.seekerInitiate.bowed).toBe(true);
            });
        });
    });
});
