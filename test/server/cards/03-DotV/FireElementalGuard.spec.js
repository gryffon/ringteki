describe('Fire Elemental Guard', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['fire-elemental-guard'],
                    hand: ['fine-katana', 'embrace-the-void', 'against-the-waves', 'grasp-of-earth']
                },
                player2: {
                    inPlay: ['soshi-illusionist'],
                    hand: ['cloud-the-mind', 'tainted-koku']
                }
            });

            this.fireElementalGuard = this.player1.findCardByName('fire-elemental-guard');

            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.embraceTheVoid = this.player1.findCardByName('embrace-the-void');
            this.againstTheWaves = this.player1.findCardByName('against-the-waves');
            this.graspOfEarth = this.player1.findCardByName('grasp-of-earth');

            this.soshiIllusionist = this.player2.findCardByName('soshi-illusionist');
            this.cloudTheMind = this.player2.findCardByName('cloud-the-mind');
            this.taintedKoku = this.player2.findCardByName('tainted-koku');
        });

        describe('Fire Elemental Guard\'s constant abililty', function() {
            it('should allow spell attachments', function() {
                this.player1.playAttachment(this.embraceTheVoid, this.fireElementalGuard);
                expect(this.embraceTheVoid.location).toBe('play area');
                expect(this.fireElementalGuard.attachments.toArray()).toContain(this.embraceTheVoid);
                this.player2.playAttachment(this.cloudTheMind, this.fireElementalGuard);
                expect(this.cloudTheMind.location).toBe('play area');
                expect(this.fireElementalGuard.attachments.toArray()).toContain(this.cloudTheMind);
            });

            it('should prevent non-spell attachments', function() {
                this.player1.playAttachment(this.fineKatana, this.fireElementalGuard);
                expect(this.fineKatana.location).not.toBe('play area');
                expect(this.fireElementalGuard.attachments.toArray()).not.toContain(this.fineKatana);
                this.player2.playAttachment(this.taintedKoku, this.fireElementalGuard);
                expect(this.taintedKoku.location).not.toBe('play area');
                expect(this.fireElementalGuard.attachments.toArray()).not.toContain(this.taintedKoku);
            });
        });

        describe('Fire Elemental Guard\'s ability', function() {
            it('should not be triggerable outside of a conflict', function() {
                this.player1.playAttachment(this.embraceTheVoid, this.fireElementalGuard);
                this.player2.pass();
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.soshiIllusionist);
                this.player2.pass();
                this.player1.playAttachment(this.graspOfEarth, this.fireElementalGuard);
                this.player2.pass();
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.fireElementalGuard);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.fireElementalGuard],
                        defenders: [this.soshiIllusionist]
                    });
                });

                describe('if 3 spell cards have been played by its controller', function() {
                    beforeEach(function() {
                        this.player2.pass();
                        this.player1.playAttachment(this.embraceTheVoid, this.fireElementalGuard);
                        this.player2.pass();
                        this.player1.clickCard(this.againstTheWaves);
                        this.player1.clickCard(this.soshiIllusionist);
                        this.player2.playAttachment(this.cloudTheMind, this.soshiIllusionist);
                        this.player1.playAttachment(this.graspOfEarth, this.fireElementalGuard);
                        this.player2.pass();
                    });

                    it('should be triggerable', function() {
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        this.player1.clickCard(this.fireElementalGuard);
                        expect(this.player1).toHavePrompt('Fire Elemental Guard');
                    });

                    it('should allow selection of an attachment', function() {
                        this.player1.clickCard(this.fireElementalGuard);
                        expect(this.player1).toBeAbleToSelect(this.embraceTheVoid);
                        expect(this.player1).toBeAbleToSelect(this.cloudTheMind);
                        expect(this.player1).toBeAbleToSelect(this.graspOfEarth);
                    });

                    it('should discard the chosen attachment from play', function() {
                        this.player1.clickCard(this.fireElementalGuard);
                        this.player1.clickCard(this.cloudTheMind);
                        expect(this.cloudTheMind.location).toBe('conflict discard pile');
                    });

                    it('should not be triggerable after the conflict ends', function() {
                        this.player1.pass();
                        this.player1.clickPrompt('Yes');
                        this.player1.clickPrompt('Don\'t resolve');
                        expect(this.player1).toHavePrompt('Action Window');
                        this.player1.clickCard(this.fireElementalGuard);
                        expect(this.player1).toHavePrompt('Action Window');
                    });
                });

                it('should not be triggerable if 3 spell cards have not been played by its controller', function() {
                    this.player2.pass();
                    this.player1.playAttachment(this.embraceTheVoid, this.fireElementalGuard);
                    this.player2.pass();
                    this.player1.clickCard(this.againstTheWaves);
                    this.player1.clickCard(this.soshiIllusionist);
                    this.player2.playAttachment(this.cloudTheMind, this.fireElementalGuard);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.fireElementalGuard);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.playAttachment(this.fineKatana, this.fireElementalGuard);
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.fireElementalGuard);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
