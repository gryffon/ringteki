describe('Challenge on the Fields', function() {
    integration(function() {
        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['border-rider'],
                        hand: ['challenge-on-the-fields']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.challengeOnTheFields = this.player1.findCardByName('challenge-on-the-fields');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider],
                    defenders: [this.obstinateRecruit],
                    type: 'political'
                });
                this.player2.pass();
            });

            it('the duel should still successfully resolve with no effect', function() {
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.borderRider);
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Challenge on the Fields\'s ability interaction with nested duels', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['border-rider', 'battle-maiden-recruit', 'ide-messenger', 'aggressive-moto'],
                        hand: ['challenge-on-the-fields', 'defend-your-honor']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['agasha-swordsmith', 'ancient-master', 'togashi-mitsu'],
                        hand: ['contingency-plan']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.battleMaidenRecruit = this.player1.findCardByName('battle-maiden-recruit');
                this.ideMessenger = this.player1.findCardByName('ide-messenger');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.challengeOnTheFields = this.player1.findCardByName('challenge-on-the-fields');
                this.defendYourHonor = this.player1.findCardByName('defend-your-honor');

                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.ancientMaster = this.player2.findCardByName('ancient-master');
                this.togashiMitsu = this.player2.findCardByName('togashi-mitsu');
                this.contingencyPlan = this.player2.findCardByName('contingency-plan');
            });

            it('the bonus to military skill should continue throughout all of the nested duels', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.battleMaidenRecruit);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickPrompt('4');
                this.player2.clickPrompt('3');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.contingencyPlan);
                this.player2.clickCard(this.contingencyPlan);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.defendYourHonor);
                this.player1.clickCard(this.defendYourHonor);
                this.player1.clickCard(this.borderRider);
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.battleMaidenRecruit.getMilitarySkill()).toBe(0 + 2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1 + 1);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.getChatLogs(2)).toContain('Border Rider: 3 vs 4: Agasha Swordsmith'); // 2 (skill) + 1 (honor bid) vs. 1 (skill) + 1 (CotF) + 2 (honor bid)
                expect(this.player2).toHavePrompt('Contingency Plan');
                this.player2.clickPrompt('Increase honor bid');
                expect(this.getChatLogs(4)).toContain('Battle Maiden Recruit: 3 vs 5: Agasha Swordsmith'); // 0 (skill) + 2 (CotF) + 1 (honor bid) vs. 1 (skill) + 1 (CotF) + 3 (honor bid)
                expect(this.battleMaidenRecruit.isParticipating()).toBe(false);
                expect(this.battleMaidenRecruit.getMilitarySkill()).toBe(0);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1);
            });
        });

        describe('Challenge on the Fields\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['border-rider', 'battle-maiden-recruit', 'ide-messenger', 'aggressive-moto'],
                        hand: ['challenge-on-the-fields']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['agasha-swordsmith', 'ancient-master', 'togashi-mitsu'],
                        hand: ['stay-your-hand']
                    }
                });
                this.borderRider = this.player1.findCardByName('border-rider');
                this.battleMaidenRecruit = this.player1.findCardByName('battle-maiden-recruit');
                this.ideMessenger = this.player1.findCardByName('ide-messenger');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.challengeOnTheFields = this.player1.findCardByName('challenge-on-the-fields');

                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.ancientMaster = this.player2.findCardByName('ancient-master');
                this.togashiMitsu = this.player2.findCardByName('togashi-mitsu');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.challengeOnTheFields);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to select a participating character on your side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player1).toBeAbleToSelect(this.ideMessenger);
                expect(this.player1).not.toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).not.toBeAbleToSelect(this.ancientMaster);
                expect(this.player1).not.toBeAbleToSelect(this.togashiMitsu);
            });

            it('should prompt to select a participating character on your opponent\'s side', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.borderRider);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.battleMaidenRecruit);
                expect(this.player1).not.toBeAbleToSelect(this.ideMessenger);
                expect(this.player1).not.toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player1).toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).toBeAbleToSelect(this.ancientMaster);
                expect(this.player1).not.toBeAbleToSelect(this.togashiMitsu);
            });

            it('should give each character in the duel +1 military for each other participating character on their side until the end of the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1);
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.borderRider);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player2.clickPrompt('Pass');
                expect(this.borderRider.getMilitarySkill()).toBe(2 + 2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1 + 1);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1);
            });

            it('should send the loser home', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.borderRider);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                expect(this.borderRider.inConflict).toBe(true);
                expect(this.agashaSwordsmith.inConflict).toBe(false);
            });

            it('should remove the bonuses if the duel is canceled', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderRider, this.battleMaidenRecruit, this.ideMessenger],
                    defenders: [this.agashaSwordsmith, this.ancientMaster],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1);
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.borderRider);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player2.clickCard('stay-your-hand');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.borderRider.getMilitarySkill()).toBe(2);
                expect(this.agashaSwordsmith.getMilitarySkill()).toBe(1);
            });
        });
    });
});
