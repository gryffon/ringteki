describe('Tainted Hero', function() {
    integration(function() {
        describe('Tainted Hero\'s ability', function() {
            describe('when attacking', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['tainted-hero', 'hida-guardian'],
                            provinces: ['shameful-display']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator'],
                            provinces: ['manicured-garden']
                        }
                    });

                    this.taintedHero = this.player1.findCardByName('tainted-hero');
                    this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                    this.shamefulDisplay = this.player1.findCardByName('shameful-display', 'province 1');

                    this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                    this.manicuredGarden = this.player2.findCardByName('manicured-garden', 'province 1');
                });

                it('should not be allowed to be declared as an attacker', function() {

                    // skip pre-conflict action phase
                    this.noMoreActions();

                    // select ring and province to attack
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Military Fire Conflict');
                    this.player1.clickCard(this.manicuredGarden);

                    // should allow the player to attack with the hida guardian
                    this.player1.clickCard(this.hidaGuardian);
                    expect(this.game.currentConflict.attackers).toContain(this.hidaGuardian);
                    expect(this.hidaGuardian.inConflict).toBe(true);

                    // should not allow the player to attack with the tainted hero
                    this.player1.clickCard(this.taintedHero);
                    expect(this.game.currentConflict.attackers).not.toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).not.toBe(true);

                    // initiate the conflict
                    this.player1.clickPrompt('Initiate Conflict');
                    expect(this.player2).toHavePrompt('Choose Defenders');
                });

                it('should be allowed to be declared as an attacker after sacrificing a friendly character', function() {

                    // pre-conflict actions
                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.player1.clickCard(this.taintedHero);
                    expect(this.player1).toHavePrompt('Select card to sacrifice');
                    this.player1.clickCard(this.hidaGuardian);
                    expect(this.hidaGuardian.location).toBe('dynasty discard pile');

                    expect(this.player2).toHavePrompt('Initiate an action');
                    this.noMoreActions();

                    // select ring and province to attack
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Military Fire Conflict');
                    this.player1.clickCard(this.manicuredGarden);

                    // should not allow the player to attack with the tainted hero
                    this.player1.clickCard(this.taintedHero);
                    expect(this.game.currentConflict.attackers).toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).toBe(true);

                    // initiate the conflict
                    this.player1.clickPrompt('Initiate Conflict');
                    expect(this.player2).toHavePrompt('Choose Defenders');
                });
            });

            describe('when defending', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['bayushi-manipulator'],
                            provinces: ['manicured-garden']
                        },
                        player2: {
                            inPlay: ['tainted-hero', 'hida-guardian'],
                            provinces: ['shameful-display']
                        }
                    });

                    this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
                    this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');

                    this.taintedHero = this.player2.findCardByName('tainted-hero');
                    this.hidaGuardian = this.player2.findCardByName('hida-guardian');
                    this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                });

                it('should not be allowed to be declared as an defender', function() {

                    // skip pre-conflict action phase
                    this.noMoreActions();

                    // select ring and province to attack
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Military Fire Conflict');
                    this.player1.clickCard(this.shamefulDisplay);

                    // should allow the player to attack with the bayushi manipulator
                    this.player1.clickCard(this.bayushiManipulator);
                    expect(this.game.currentConflict.attackers).toContain(this.bayushiManipulator);
                    expect(this.bayushiManipulator.inConflict).toBe(true);

                    // initiate the conflict
                    this.player1.clickPrompt('Initiate Conflict');
                    expect(this.player2).toHavePrompt('Choose Defenders');

                    // should allow the player to defend with the hida guardian
                    this.player2.clickCard(this.hidaGuardian);
                    expect(this.game.currentConflict.defenders).toContain(this.hidaGuardian);
                    expect(this.hidaGuardian.inConflict).toBe(true);

                    // should not allow the player to defend with the tainted hero
                    this.player2.clickCard(this.taintedHero);
                    expect(this.game.currentConflict.defenders).not.toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).not.toBe(true);
                });

                it('should be allowed to be declared as a defender after sacrificing a friendly character', function() {
                    // pre-conflict actions
                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.player1.pass();

                    expect(this.player2).toHavePrompt('Initiate an action');
                    this.player2.clickCard(this.taintedHero);
                    expect(this.player2).toHavePrompt('Select card to sacrifice');
                    this.player2.clickCard(this.hidaGuardian);
                    expect(this.hidaGuardian.location).toBe('dynasty discard pile');

                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.noMoreActions();

                    // select ring and province to attack
                    this.player1.clickRing('fire');
                    expect(this.player1).toHavePrompt('Military Fire Conflict');
                    this.player1.clickCard(this.shamefulDisplay);

                    // should allow the player to attack with the bayushi manipulator
                    this.player1.clickCard(this.bayushiManipulator);
                    expect(this.game.currentConflict.attackers).toContain(this.bayushiManipulator);
                    expect(this.bayushiManipulator.inConflict).toBe(true);

                    // initiate the conflict
                    this.player1.clickPrompt('Initiate Conflict');
                    expect(this.player2).toHavePrompt('Choose Defenders');

                    // should allow the player to defend with the tainted hero
                    this.player2.clickCard(this.taintedHero);
                    expect(this.game.currentConflict.defenders).toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).toBe(true);
                });
            });
        });
    });
});
