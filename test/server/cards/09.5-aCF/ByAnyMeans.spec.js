describe('By Any Means', function() {
    integration(function() {
        describe('By Any Means\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger', 'loyal-challenger', 'moto-youth'],
                        hand: ['banzai', 'by-any-means', 'kakita-blade']
                    },
                    player2: {
                        inPlay: ['akodo-toturi', 'political-rival'],
                        hand: ['way-of-the-lion', 'fine-katana']
                    }
                });

                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.loyalChallenger = this.player1.findCardByName('loyal-challenger');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.banzai = this.player1.findCardByName('banzai');
                this.byAnyMeans = this.player1.findCardByName('by-any-means');
                this.kakitaBlade = this.player1.findCardByName('kakita-blade');

                this.toturi = this.player2.findCardByName('akodo-toturi');
                this.wotl = this.player2.findCardByName('way-of-the-lion');
                this.katana = this.player2.findCardByName('fine-katana');
                this.rival = this.player2.findCardByName('political-rival');

                this.player1.player.showBid = 5;
                this.player2.player.showBid = 3;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiChallenger, this.loyalChallenger],
                    defenders: [this.toturi, this.rival],
                    type: 'political'
                });
            });

            it('should only work during a conflict', function() {
                this.player2.pass();
                this.player1.pass();
                this.player1.clickCard(this.byAnyMeans);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should only allow targeting participating bushi you control', function() {
                this.player2.pass();
                this.player1.clickCard(this.byAnyMeans);
                expect(this.player1).toHavePrompt('Choose a bushi character');
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.loyalChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.toturi);
                expect(this.player1).not.toBeAbleToSelect(this.rival);
            });

            it('should allow you to choose a participating character your opponent controls', function() {
                this.player2.pass();
                this.player1.clickCard(this.byAnyMeans);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Choose an opponent\'s character');
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.loyalChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
                expect(this.player1).toBeAbleToSelect(this.toturi);
                expect(this.player1).toBeAbleToSelect(this.rival);
            });

            it('should set its base mil skill to chosen character\'s current skill', function() {
                this.player2.pass();
                this.player1.clickCard(this.byAnyMeans);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.toturi);

                expect(this.getChatLogs(3)).toContain('player1 plays By Any Means to set Doji Challenger\'s base military skill to equal Akodo Toturi\'s current military skill');
                expect(this.dojiChallenger.getBaseMilitarySkill()).toBe(this.toturi.getMilitarySkill());
            });

            it('should set as military dash if target is military dash', function() {
                this.player2.pass();
                this.player1.clickCard(this.byAnyMeans);
                expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                this.player1.clickCard(this.dojiChallenger);
                this.player1.clickCard(this.rival);
                expect(this.dojiChallenger.hasDash('military')).toBe(true);
            });

            describe('Skill Pumps', function() {
                it('should maintain skill pumps already played', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.banzai);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickPrompt('Done');
                    this.player2.pass();
                    this.player1.clickCard(this.byAnyMeans);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickCard(this.toturi);
                    expect(this.dojiChallenger.getBaseMilitarySkill()).toBe(this.toturi.getMilitarySkill());
                    expect(this.dojiChallenger.getMilitarySkill()).toBe(this.dojiChallenger.getBaseMilitarySkill() + 4);
                });

                it('should copy skill pumps already played', function() {
                    this.player2.clickCard(this.wotl);
                    this.player2.clickCard(this.toturi);
                    this.player1.clickCard(this.byAnyMeans);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickCard(this.toturi);

                    expect(this.dojiChallenger.getBaseMilitarySkill()).toBe(this.toturi.getMilitarySkill());
                });

                it('attachments', function() {
                    this.player2.clickCard(this.katana);
                    this.player2.clickCard(this.toturi);
                    this.player1.clickCard(this.kakitaBlade);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player2.pass();
                    this.player1.clickCard(this.byAnyMeans);
                    expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
                    this.player1.clickCard(this.dojiChallenger);
                    this.player1.clickCard(this.toturi);

                    expect(this.dojiChallenger.getBaseMilitarySkill()).toBe(this.toturi.getMilitarySkill());
                    expect(this.dojiChallenger.getMilitarySkill()).toBe(this.toturi.getBaseMilitarySkill() + 4);
                });
            });

            describe('Dial Condition', function() {
                it('should not be playable while dials are equal', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.loyalChallenger);
                    this.player1.clickCard(this.toturi);
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('1');
                    this.player2.pass();
                    this.player1.clickCard(this.byAnyMeans);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not be playable while dial is lower', function() {
                    this.player2.pass();
                    this.player1.clickCard(this.loyalChallenger);
                    this.player1.clickCard(this.toturi);
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('2');
                    this.player2.pass();
                    this.player1.clickCard(this.byAnyMeans);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
