describe('From the Shadows', function() {
    integration(function() {
        describe('When playing From the Shadows\'s', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-shadows'],
                        dynastyDeck: ['young-rumormonger']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro'],
                        dynastyDeck: ['miya-mystic', 'disguised-protector'],
                        hand: ['from-the-shadows', 'shosuro-sadako', 'bayushi-kachiko']
                    }
                });
                this.adeptOfShadows = this.player1.findCardByName('adept-of-shadows');
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.disguisedProtector = this.player2.placeCardInProvince('disguised-protector', 'province 1');
                this.miyaMystic = this.player2.placeCardInProvince('miya-mystic', 'province 2');
                this.shosuroSadako = this.player2.findCardByName('shosuro-sadako');
                this.bayushiKachiko = this.player2.findCardByName('bayushi-kachiko');
            });

            it('should not be playable in a pre-conflict window', function() {
                this.player1.pass();
                this.player2.clickCard('from-the-shadows', 'hand');
                expect(this.player2).toHavePrompt('Initiate an action');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.adeptOfShadows],
                        defenders: []
                    });
                });

                describe('when the opponent is less honorable', function() {
                    beforeEach(function() {
                        this.player1.honor = 8;
                        this.player2.honor = 10;
                        this.player2.clickCard('from-the-shadows', 'hand');
                    });

                    it('should not be playable', function() {
                        this.player2.clickCard('from-the-shadows', 'hand');
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });
                });

                describe('when the opponent is equally honorable', function() {
                    beforeEach(function() {
                        this.player1.honor = 9;
                        this.player2.honor = 9;
                        this.player2.clickCard('from-the-shadows', 'hand');
                    });

                    it('should not be playable', function() {
                        this.player2.clickCard('from-the-shadows', 'hand');
                        expect(this.player2).toHavePrompt('Conflict Action Window');
                    });
                });

                describe('when the opponent is more honorable', function() {
                    beforeEach(function() {
                        this.player1.honor = 10;
                        this.player2.honor = 8;
                        this.player2.clickCard('from-the-shadows', 'hand');
                    });

                    it('should allow selecting a character', function() {
                        expect(this.player2).toHavePrompt('Choose a character');
                    });

                    it('should not allow selecting a non-shinobi dynasty character', function() {
                        this.player2.clickCard(this.miyaMystic);
                        expect(this.player2).toHavePrompt('Choose a character');
                    });

                    it('should not allow selecting a non-shinobi conflict character', function() {
                        this.player2.clickCard(this.bayushiKachiko);
                        expect(this.player2).toHavePrompt('Choose a character');
                    });

                    it('should not allow selecting a shinobi character that is in play', function() {
                        this.player2.clickCard(this.bayushiAramoro);
                        expect(this.player2).toHavePrompt('Choose a character');
                    });

                    it('should not allow selecting an opponents shinobi character', function() {
                        this.player2.clickCard(this.adeptOfShadows);
                        expect(this.player2).toHavePrompt('Choose a character');
                    });

                    it('should allow selecting a shinobi dynasty character', function() {
                        this.player2.clickCard(this.disguisedProtector);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                    });

                    it('should allow selecting a shinobi conflict character', function() {
                        this.player2.clickCard(this.shosuroSadako);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                    });

                    describe('when a legal character is selected', function() {
                        beforeEach(function() {
                            this.player2.clickCard(this.disguisedProtector);
                        });

                        it('should put the character into play in the conflict', function() {
                            expect(this.disguisedProtector.inConflict).toBe(true);
                            expect(this.game.currentConflict.defenders).toContain(this.disguisedProtector);
                        });

                        it('the character should enter play dishonored', function() {
                            expect(this.disguisedProtector.isDishonored).toBe(true);
                        });

                        describe('if Young Rumormonger is in play', function() {
                            beforeEach(function() {
                                this.youngRumormonger = this.player1.placeCardInProvince('young-rumormonger', 'province 1');
                                this.player1.putIntoPlay(this.youngRumormonger);
                            });

                            it('should not allow Young Rumormonger to use his ability', function() {
                                expect(this.player1.formatPrompt()).not.toContain('interrupt');
                                expect(this.player1).not.toBeAbleToSelect(this.youngRumormonger);
                                expect(this.player1).toHavePrompt('Conflict Action Window');
                                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                            });
                        });
                    });

                    describe('when Shosuro Sadako is chosen', function() {
                        beforeEach(function() {
                            this.player2.clickCard(this.shosuroSadako);
                        });

                        it('should put Shosuro Sadako into play dishonored', function() {
                            expect(this.shosuroSadako.inConflict).toBe(true);
                            expect(this.game.currentConflict.defenders).toContain(this.shosuroSadako);
                            expect(this.shosuroSadako.isDishonored).toBe(true);
                            expect(this.shosuroSadako.getMilitarySkill()).toBe(4);
                        });
                    });
                });
            });
        });
    });
});
