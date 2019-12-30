describe('Petal Village Estate', function() {
    integration(function() {
        describe('Petal Village Estate\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 30,
                        inPlay: ['bayushi-shoju', 'attendant-to-the-emperor', 'miya-mystic'],
                        hand: ['bayushi-kachiko'],
                        dynastyDeck: ['petal-village-estate']
                    },
                    player2: {
                        inPlay: ['hantei-sotorii', 'hantei-daisetsu']
                    }
                });

                this.petalVillageEstate = this.player1.placeCardInProvince('petal-village-estate', 'province 1');
                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');
                this.attendantToTheEmperor = this.player1.findCardByName('attendant-to-the-emperor');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.bayushiKachiko = this.player1.findCardByName('bayushi-kachiko');

                this.hanteiSotorii = this.player2.findCardByName('hantei-sotorii');
                this.hanteiDaisetsu = this.player2.findCardByName('hantei-daisetsu');

                this.noMoreActions();

                // initiate conflict
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju, this.miyaMystic],
                    defenders: [this.hanteiSotorii]
                });
            });

            it('should give +1/+1 only to the controller\'s imperial characters in play', function() {
                expect(this.attendantToTheEmperor.getMilitarySkill()).toBe(this.attendantToTheEmperor.getBaseMilitarySkill() + 1);
                expect(this.attendantToTheEmperor.getPoliticalSkill()).toBe(this.attendantToTheEmperor.getBasePoliticalSkill() + 1);
                expect(this.miyaMystic.getMilitarySkill()).toBe(this.miyaMystic.getBaseMilitarySkill() + 1);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(this.miyaMystic.getBasePoliticalSkill() + 1);

                expect(this.bayushiShoju.getMilitarySkill()).toBe(this.bayushiShoju.getBaseMilitarySkill());
                expect(this.bayushiShoju.getPoliticalSkill()).toBe(this.bayushiShoju.getBasePoliticalSkill());
                expect(this.hanteiDaisetsu.getMilitarySkill()).toBe(this.hanteiDaisetsu.getBaseMilitarySkill());
                expect(this.hanteiDaisetsu.getPoliticalSkill()).toBe(this.hanteiDaisetsu.getBasePoliticalSkill());
                expect(this.hanteiSotorii.getMilitarySkill()).toBe(this.hanteiSotorii.getBaseMilitarySkill());
                expect(this.hanteiSotorii.getPoliticalSkill()).toBe(this.hanteiSotorii.getBasePoliticalSkill());
            });

            it('should give +1/+1 to a controller\'s imperial character when it is played from hand', function() {
                // play a character from hand into conflict
                this.player2.pass();
                this.player1.playCharacterFromHand(this.bayushiKachiko);
                expect(this.player1).toHavePrompt('Where do you wish to play this character?');
                this.player1.clickPrompt('Conflict');

                // test card abilities have taken effect
                expect(this.bayushiKachiko.getMilitarySkill()).toBe(this.bayushiKachiko.getBaseMilitarySkill() + 1);
                expect(this.bayushiKachiko.getPoliticalSkill()).toBe(this.bayushiKachiko.getBasePoliticalSkill() + 1);
            });
        });
    });
});
