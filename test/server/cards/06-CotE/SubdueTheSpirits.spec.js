describe('Subdue the Spirits', function() {
    integration(function() {
        describe('Subdue the Spirits\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['adept-of-the-waves', 'meddling-mediator'],
                        hand: ['subdue-the-spirits', 'seeker-of-knowledge','court-games'],
                        stronghold: ['isawa-mori-seido']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['doji-whisperer','apprentice-earthcaller'],
                        hand: ['court-games']
                    }
                });

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.meddlingMediator = this.player1.findCardByName('meddling-mediator');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.apprenticeEarthcaller = this.player2.findCardByName('apprentice-earthcaller');

                this.subdueTheSpirits = this.player1.findCardByName('subdue-the-spirits');
                this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
                this.courtGames = this.player1.findCardByName('court-games');
                this.courtGames2 = this.player2.findCardByName('court-games');

                this.isawaMoriSeido = this.player1.findCardByName('isawa-mori-seido');
            });

            it('should not be playable outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.subdueTheSpirits);
                expect(this.player1).toHavePrompt('Action Window');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.adeptOfTheWaves],
                        defenders: [this.dojiWhisperer],
                        type: 'political'
                    });
                    this.player2.pass();
                });

                it('should not be playable if you are equally honorable', function() {
                    this.player1.player.honor = 10;
                    this.player2.player.honor = 10;
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.subdueTheSpirits);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not be playable if you are less honorable', function() {
                    this.player1.player.honor = 9;
                    this.player2.player.honor = 10;
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.subdueTheSpirits);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                describe('if it resolves', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.subdueTheSpirits);
                    });

                    it('should add glory to both skills of each participating character you control', function() {
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(4);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(4);
                    });

                    it('should not effect characters outside of the conflict and characters you do not control', function() {
                        expect(this.meddlingMediator.getMilitarySkill()).toBe(0);
                        expect(this.meddlingMediator.getPoliticalSkill()).toBe(3);
                        expect(this.dojiWhisperer.getMilitarySkill()).toBe(0);
                        expect(this.dojiWhisperer.getPoliticalSkill()).toBe(3);
                    });

                    it('should add in addition to honor effects', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.courtGames);
                        this.player1.clickPrompt('Honor a friendly character');
                        this.player1.clickCard(this.adeptOfTheWaves);
                        expect(this.adeptOfTheWaves.isHonored).toBe(true);
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(6);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(6);
                    });

                    it('should add in addition to dishonor effects', function() {
                        this.player2.clickCard(this.courtGames2);
                        this.player2.clickPrompt('Dishonor an opposing character');
                        this.player1.clickCard(this.adeptOfTheWaves);
                        expect(this.adeptOfTheWaves.isDishonored).toBe(true);
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(2);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(2);
                    });

                    it('should not affect a new character in the conflict', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.seekerOfKnowledge);
                        this.player1.clickPrompt('0');
                        this.player1.clickPrompt('Conflict');
                        expect(this.seekerOfKnowledge.inConflict).toBe(true);
                        expect(this.seekerOfKnowledge.getMilitarySkill()).toBe(0);
                        expect(this.seekerOfKnowledge.getPoliticalSkill()).toBe(2);
                    });

                    it('should take account of any changes to glory', function() {
                        this.player2.pass();
                        this.player1.clickCard(this.isawaMoriSeido);
                        this.player1.clickCard(this.adeptOfTheWaves);
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(6);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(6);
                    });

                    it('should be overridden by a set effect', function() {
                        this.player2.clickCard(this.apprenticeEarthcaller);
                        this.player2.clickCard(this.adeptOfTheWaves);
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(2);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(2);
                    });

                    it('should last until the end of the conflict', function() {
                        this.noMoreActions();
                        this.player1.clickPrompt('Don\'t Resolve');
                        expect(this.player1).toHavePrompt('Action Window');
                        expect(this.adeptOfTheWaves.getMilitarySkill()).toBe(2);
                        expect(this.adeptOfTheWaves.getPoliticalSkill()).toBe(2);
                    });

                });
            });
        });
    });
});
