describe('Smuggling Deal', function() {
    integration(function() {
        describe('Smuggling Deal\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kudaka', 'hida-yakamo', 'seeker-of-knowledge', 'daring-challenger'],
                        hand: ['smuggling-deal', 'duelist-training', 'know-the-world']
                    },
                    player2: {
                        inPlay: ['adept-of-shadows'],
                        hand: ['blackmail'],
                        provinces: ['shameful-display', 'fertile-fields']
                    }
                });
                this.kudaka = this.player1.findCardByName('kudaka');
                this.hidaYakamo = this.player1.findCardByName('hida-yakamo');
                this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
                this.daringChallenger = this.player1.findCardByName('daring-challenger');
                this.smugglingDeal = this.player1.findCardByName('smuggling-deal');
                this.duelistTraining = this.player1.findCardByName('duelist-training');
                this.knowTheWorld = this.player1.findCardByName('know-the-world');

                this.adeptOfShadows = this.player2.findCardByName('adept-of-shadows');
                this.blackmail = this.player2.findCardByName('blackmail');
            });

            it('should prompt to choose a triggered ability on a character you control', function() {
                this.player1.clickCard(this.smugglingDeal);
                expect(this.player1).toHavePrompt('Smuggling Deal');
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                expect(this.player1).toBeAbleToSelect(this.daringChallenger);
                expect(this.player1).not.toBeAbleToSelect(this.hidaYakamo);
                expect(this.player1).not.toBeAbleToSelect(this.seekerOfKnowledge);
                expect(this.player1).not.toBeAbleToSelect(this.adeptOfShadows);
            });

            it('should give 1 honor to your opponent as a cost', function() {
                let player1honor = this.player1.player.honor;
                let player2honor = this.player2.player.honor;
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.kudaka);
                expect(this.player1.player.honor).toBe(player1honor - 1);
                expect(this.player2.player.honor).toBe(player2honor + 1);
            });

            it('should handle more than one ability on a character', function() {
                this.player1.clickCard(this.duelistTraining);
                expect(this.player1).toHavePrompt('Duelist Training');
                this.player1.clickCard(this.kudaka);
                expect(this.kudaka.attachments.toArray()).toContain(this.duelistTraining);
                this.player2.pass();
                this.player1.clickCard(this.smugglingDeal);
                expect(this.player1).toHavePrompt('Smuggling Deal');
                this.player1.clickCard(this.kudaka);
                expect(this.player1).toHavePrompt('Choose an ability');
            });

            it('should allow you to trigger that ability an additional time', function() {
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.daringChallenger);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.daringChallenger],
                    defenders: [this.adeptOfShadows]
                });
                this.player2.pass();
                this.player1.clickCard(this.daringChallenger);
                expect(this.player1).toHavePrompt('Daring Challenger');
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.daringChallenger);
                expect(this.player1).toHavePrompt('Daring Challenger');
            });

            it('should allow you to trigger that ability an additional time (original limit \'twice\')', function() {
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.kudaka);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kudaka],
                    defenders: [],
                    ring: 'air'
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                this.player1.clickCard(this.kudaka);
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.knowTheWorld);
                this.player1.clickRing('air');
                this.player1.clickRing('fire');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.adeptOfShadows],
                    defenders: [this.hidaYakamo],
                    ring: 'air'
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                this.player1.clickCard(this.kudaka);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.seekerOfKnowledge],
                    defenders: [],
                    ring: 'earth',
                    province: 'fertile-fields'
                });
                this.noMoreActions();
                this.player1.clickRing('earth');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kudaka);
                this.player1.clickCard(this.kudaka);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not allow your opponent to trigger that ability an additional time (if control is transferred)', function() {
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.daringChallenger);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.daringChallenger, this.seekerOfKnowledge],
                    defenders: [this.adeptOfShadows]
                });
                this.player2.pass();
                this.player1.clickCard(this.daringChallenger);
                expect(this.player1).toHavePrompt('Daring Challenger');
                this.player1.clickCard(this.adeptOfShadows);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player2.player.honor < this.player1.player.honor).toBe(true);
                expect(this.daringChallenger.controller).toBe(this.player1.player);
                this.player2.clickCard(this.blackmail);
                this.player2.clickCard(this.daringChallenger);
                expect(this.daringChallenger.controller).toBe(this.player2.player);
                this.player1.pass();
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.daringChallenger);
                expect(this.player2).toHavePrompt('Daring Challenger');
                this.player2.clickCard(this.seekerOfKnowledge);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.player1.pass();
                this.player2.clickCard(this.daringChallenger);
                expect(this.player2).not.toHavePrompt('Daring Challenger');
            });
        });

        describe('Smuggling Deal & Young Rumormonger & Kitsuki Shomon interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-shomon', 'hida-yakamo'],
                        hand: ['smuggling-deal']
                    },
                    player2: {
                        inPlay: ['young-rumormonger'],
                        hand: ['mark-of-shame']
                    }
                });
                this.kitsukiShomon = this.player1.findCardByName('kitsuki-shomon');
                this.hidaYakamo = this.player1.findCardByName('hida-yakamo');
                this.smugglingDeal = this.player1.findCardByName('smuggling-deal');

                this.youngRumormonger = this.player2.findCardByName('young-rumormonger');
                this.markOfShame = this.player2.findCardByName('mark-of-shame');

                this.kitsukiShomon.bowed = true;
            });

            it('should allow Kitsuki Shomon to trigger a second time', function() {
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.kitsukiShomon);
                this.player2.clickCard(this.markOfShame);
                this.player2.clickCard(this.hidaYakamo);
                this.player2.clickCard(this.markOfShame);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                this.player2.clickCard(this.youngRumormonger);
                this.player2.clickCard(this.hidaYakamo);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
            });
        });

        describe('Smuggling Deal\'s ability if target leaves play during resolution', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['obstinate-recruit'],
                        hand: ['smuggling-deal', 'duelist-training']
                    }
                });
                this.obstinateRecruit = this.player1.findCardByName('obstinate-recruit');
                this.smugglingDeal = this.player1.findCardByName('smuggling-deal');
                this.duelistTraining = this.player1.findCardByName('duelist-training');

                this.player1.clickCard(this.duelistTraining);
                this.player1.clickCard(this.obstinateRecruit);
                this.player2.pass();
            });

            it('should resolve without error (without effect)', function() {
                this.player1.clickCard(this.smugglingDeal);
                this.player1.clickCard(this.obstinateRecruit);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
