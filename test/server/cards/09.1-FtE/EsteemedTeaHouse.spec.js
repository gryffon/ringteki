describe('EsteemedTeaHouse', function() {
    integration(function() {
        describe('Esteemed Tea Houses\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-challenger'],
                        hand: ['fine-katana'],
                        dynastyDiscard: ['esteemed-tea-house']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves', 'miya-mystic'],
                        hand: ['ornate-fan', 'cloud-the-mind']
                    }
                });

                this.esteemedteahouse = this.player1.placeCardInProvince('esteemed-tea-house');
                this.player1.pass();
                this.player2.playAttachment('ornate-fan', 'adept-of-the-waves');
                this.player1.playAttachment('fine-katana', 'doji-whisperer');
                this.player2.playAttachment('cloud-the-mind', 'miya-mystic');
                this.ornatefan = this.player2.findCardByName('ornate-fan');
                this.finekatana = this.player1.findCardByName('fine-katana');
                this.cloud = this.player2.findCardByName('cloud-the-mind');
                this.adept = this.player2.findCardByName('adept-of-the-waves');
                this.adept.fate = 1;
                this.noMoreActions();
            });

            it('should return attachment to hand', function() {
                this.initiateConflict({
                    attackers: ['doji-whisperer'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.esteemedteahouse);
                expect(this.ornatefan.location).toBe('play area');
                this.player1.clickCard(this.ornatefan);
                expect(this.ornatefan.location).toBe('hand');
            });

            it('should not work unless a courtier is participating', function() {
                this.initiateConflict({
                    attackers: ['doji-challenger'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.esteemedteahouse);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should only allow choosing participating character attachments', function() {
                this.initiateConflict({
                    attackers: ['doji-whisperer'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.esteemedteahouse);
                expect(this.player1).toBeAbleToSelect(this.ornatefan);
                expect(this.player1).toBeAbleToSelect(this.finekatana);
                expect(this.player1).not.toBeAbleToSelect(this.cloud);
            });

            it('should not allow copies of attachment be played again until end of phase', function() {
                this.initiateConflict({
                    attackers: ['doji-whisperer'],
                    defenders: ['adept-of-the-waves'],
                    type: 'political',
                    ring: 'air'
                });
                this.player2.pass();
                this.player1.clickCard(this.esteemedteahouse);
                this.player1.clickCard(this.ornatefan);
                this.player2.clickCard(this.ornatefan);
                // ornate fan should stay in hand and not play
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.ornatefan.location).toBe('hand');
                this.noMoreActions();
                this.player1.clickPrompt('Gain 2 Honor');
                this.nextPhase();

                // player2 should be able to play fan now in the fate phase
                this.player1.clickPrompt('Done');
                this.player2.player.promptedActionWindows.fate = true;
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.ornatefan);
                this.player2.clickCard(this.adept);
                expect(this.ornatefan.location).toBe('play area');
            });
        });
    });
});
