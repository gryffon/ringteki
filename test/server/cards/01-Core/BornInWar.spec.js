describe('Born in War', function () {
    integration(function () {
        describe('Born in War', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'miya-mystic'],
                        hand: ['born-in-war']
                    },
                    player2: {
                        inPlay: ['moto-chagatai']
                    }
                });

                this.borderRider = this.player1.findCardByName('border-rider');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.bornInWar = this.player1.findCardByName('born-in-war');
                this.motoChagatai = this.player2.findCardByName('moto-chagatai');
            });

            it('should only be attachable to cavalry characters', function () {
                this.player1.clickCard(this.bornInWar);
                expect(this.player1).toHavePrompt('Born in War');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).toBeAbleToSelect(this.motoChagatai);
                expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            });

            it('should grant as much military as there a unclaimed rings', function () {
                let military = this.borderRider.getMilitarySkill();
                this.player1.playAttachment(this.bornInWar, this.borderRider);
                expect(this.borderRider.getMilitarySkill()).toBe(military + 5);
                this.player1.claimRing('air');
                expect(this.borderRider.getMilitarySkill()).toBe(military + 4);
                this.player1.claimRing('fire');
                expect(this.borderRider.getMilitarySkill()).toBe(military + 3);
                this.player1.claimRing('water');
                expect(this.borderRider.getMilitarySkill()).toBe(military + 2);
                this.player1.claimRing('void');
                expect(this.borderRider.getMilitarySkill()).toBe(military + 1);
                this.player1.claimRing('earth');
                expect(this.borderRider.getMilitarySkill()).toBe(military);
            });
        });
    });
});
