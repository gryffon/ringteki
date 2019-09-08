describe('Conflict Between Kin', function() {
    integration(function() {
        describe('Conflict Between Kin\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['formal-invitation', 'fine-katana', 'noble-sacrifice'],
                        provinces: ['conflict-between-kin']
                    },
                    player2: {
                        inPlay: ['callow-delegate', 'doji-hotaru', 'asahina-artisan', 'keeper-initiate'],
                        hand: ['way-of-the-crane', 'formal-invitation', 'fine-katana']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.conflictBetweenKin = this.player1.findCardByName('conflict-between-kin');
                this.formalInvitationP1 = this.player1.findCardByName('formal-invitation');
                this.fineKatanaP1 = this.player1.findCardByName('fine-katana');
                this.nobleSacrifice = this.player1.findCardByName('noble-sacrifice');

                this.callowDelegate = this.player2.findCardByName('callow-delegate');
                this.dojiHotaru = this.player2.findCardByName('doji-hotaru');
                this.asahinaArtisan = this.player2.findCardByName('asahina-artisan');
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');
                this.formalInvitationP2 = this.player2.findCardByName('formal-invitation');
                this.fineKatanaP2 = this.player2.findCardByName('fine-katana');

                this.noMoreActions();
                this.player1.passConflict();
            });

            it('should prevent opponent\'s participating characters from being chosen as a target for clan-matching events', function() {
                this.brashSamurai.honor();
                this.callowDelegate.dishonor();
                this.dojiHotaru.dishonor();
                this.asahinaArtisan.dishonor();
                this.keeperInitiate.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.callowDelegate, this.keeperInitiate],
                    defenders: [this.brashSamurai],
                    province: this.conflictBetweenKin
                });
                this.player1.clickCard(this.nobleSacrifice);
                expect(this.player1).not.toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
                expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player1).toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                this.player1.clickCard(this.dojiHotaru);
                this.player1.clickCard(this.brashSamurai);
                this.player2.clickCard(this.wayOfTheCrane);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).not.toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).not.toBeAbleToSelect(this.keeperInitiate);
                expect(this.player2).toBeAbleToSelect(this.asahinaArtisan);
            });

            it('should prevent clan-matching attachments being played on opponent\'s participating characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asahinaArtisan, this.keeperInitiate],
                    defenders: [this.brashSamurai],
                    province: this.conflictBetweenKin
                });
                this.player1.clickCard(this.formalInvitationP1);
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.callowDelegate);
                expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player1).not.toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                this.player1.clickCard(this.dojiHotaru);
                this.player2.clickCard(this.formalInvitationP2);
                expect(this.player2).toBeAbleToSelect(this.brashSamurai);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).not.toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player2).not.toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player2).toBeAbleToSelect(this.dojiHotaru);
                this.player2.clickCard(this.dojiHotaru);
                this.player1.clickCard(this.fineKatanaP1);
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.callowDelegate);
                expect(this.player1).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player1).toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                this.player1.clickCard(this.brashSamurai);
                this.player2.clickCard(this.fineKatanaP2);
                expect(this.player2).toBeAbleToSelect(this.brashSamurai);
                expect(this.player2).toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).toBeAbleToSelect(this.callowDelegate);
                expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                expect(this.player2).toBeAbleToSelect(this.asahinaArtisan);
                expect(this.player2).toBeAbleToSelect(this.dojiHotaru);
                this.player2.clickCard(this.brashSamurai);
            });
        });
    });
});
