describe('Hantei XXXVII', function() {
    integration(function() {
        describe('Hantei XXXVII\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        fate: 4,
                        inPlay: ['hantei-xxxviii', 'asahina-storyteller'],
                        hand: ['fine-katana', 'ornate-fan', 'banzai']
                    },
                    player2: {
                        fate: 5,
                        honor: 10,
                        inPlay: [
                            'asako-azunami', 'favored-niece','fusui-disciple', 'fawning-diplomat', 'guardian-kami',
                            'kitsuki-investigator', 'prudent-challenger', 'utako-kamoko', 'doji-gift-giver'
                        ],
                        provinces: ['upholding-authority'],
                        dynastyDiscard: ['young-rumormonger', 'secluded-shrine'],
                        conflictDiscard: ['honored-blade', 'time-for-war'],
                        hand: [
                            'ambush', 'backhanded-compliment', 'court-games', 'duelist-training',
                            'noble-sacrifice', 'policy-debate', 'taryu-jiai', 'the-perfect-gift',
                            'bayushi-kachiko', 'bayushi-kachiko', 'soul-beyond-reproach'
                        ]
                    }
                });
                this.hantei = this.player1.findCardByName('hantei-xxxviii');
                this.asahinaStoryteller = this.player1.findCardByName('asahina-storyteller');
                this.fineKatana = this.player1.findCardByName('fine-katana');

                this.utakuKamoko = this.player2.findCardByName('utaku-kamoko');
                this.prudentChallenger = this.player2.findCardByName('prudent-challenger');
                this.kitsukiInvestigator = this.player2.findCardByName('kitsuki-investigator');
                this.fawningDiplomat = this.player2.findCardByName('fawning-diplomat');
                this.dojiGiftGiver = this.player2.findCardByName('doji-gift-giver');
                this.fusuiDisciple = this.player2.findCardByName('fusui-disciple');
                this.guardianKami = this.player2.findCardByName('guardian-kami');
                this.honoredBlade = this.player2.findCardByName('honored-blade');
                this.secludedShrine = this.player2.placeCardInProvince('secluded-shrine');
                this.utakuKamoko.bow();
                this.fawningDiplomat.honor();

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();

                this.player2.clickCard(this.secludedShrine);
                this.player1.pass();
                this.player2.clickRing('air');

                this.ornateFan = this.player1.playAttachment('fine-katana', this.asahinaStoryteller);
                this.duelistTraining = this.player2.playAttachment('duelist-training', this.prudentChallenger);
                this.player1.pass();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    province: 'upholding-authority',
                    ring: 'water',
                    attackers: [this.asahinaStoryteller],
                    defenders: [this.prudentChallenger, this.kitsukiInvestigator, this.dojiGiftGiver, this.guardianKami]
                });
            });

            it('should trigger after pre-targeting but before costs are paid', function() {
                this.asahinaStoryteller.dishonor();
                this.player2.clickCard('noble-sacrifice');
                expect(this.player2).toHavePrompt('Noble Sacrifice');
                expect(this.player2).toBeAbleToSelect(this.asahinaStoryteller);
                this.player2.clickCard(this.asahinaStoryteller);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
            });

            it('should not trigger for abilities with no targets', function() {
                this.player2.clickCard(this.guardianKami);
                expect(this.guardianKami.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Triggered Abilities');
            });

            it('should not trigger for abilities with targets chosen by opponent', function() {
                this.player2.clickCard(this.dojiGiftGiver);
                expect(this.player1.fate).toBe(5);
                expect(this.player2.fate).toBe(2);
                expect(this.player1).toHavePrompt('Doji Gift Giver');
            });

            it('should prompt the opponent to choose targets after costs are paid', function() {
                this.player2.clickCard('soul-beyond-reproach');
                expect(this.player2).toHavePrompt('Soul Beyond Reproach');
                expect(this.player2).toBeAbleToSelect(this.fusuiDisciple);
                expect(this.player2).toBeAbleToSelect(this.dojiGiftGiver);
                this.player2.clickCard(this.fusuiDisciple);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player2.fate).toBe(2);
                expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                expect(this.player1).toBeAbleToSelect(this.fusuiDisciple);
                expect(this.player1).toBeAbleToSelect(this.dojiGiftGiver);
            });

            it('should trigger for Azunami', function() {
                this.player2.clickCard(this.guardianKami);
                expect(this.guardianKami.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('asako-azunami');
                this.player2.clickCard('asako-azunami');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Choose a character to bow');
                this.player1.clickCard(this.fusuiDisciple);
                expect(this.player1).toHavePrompt('Choose a character to ready');
                this.player1.clickCard(this.utakuKamoko);
                expect(this.fusuiDisciple.bowed).toBe(true);
                expect(this.utakuKamoko.bowed).toBe(false);
            });

            it('should trigger for Backhanded Compliment', function() {
                let handSize = this.player2.hand.size();
                this.player2.clickCard('backhanded-compliment');
                expect(this.player2).toHavePrompt('Backhanded Compliment');
                this.player2.clickPrompt('player1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player2).toHavePrompt('Backhanded Compliment');
                this.player2.clickPrompt('player2');
                expect(this.player2.hand.size()).toBe(handSize);
                expect(this.player2.honor).toBe(9);
            });

            it('should trigger for Court Games using pretargeting', function() {
                this.player2.clickCard('court-games');
                expect(this.player2).toHavePrompt('Court Games');
                this.player2.clickPrompt('Dishonor an opposing character');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Court Games');
                expect(this.player1).not.toBeAbleToSelect(this.fusuiDisciple);
                expect(this.player1).toBeAbleToSelect(this.asahinaStoryteller);
                this.player1.clickCard(this.asahinaStoryteller);
                expect(this.asahinaStoryteller.isDishonored).toBe(true);
            });

            it('should trigger for Court Games not using pretargeting', function() {
                this.player2.clickCard('court-games');
                expect(this.player2).toHavePrompt('Court Games');
                this.player2.clickPrompt('Pay costs first');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player2).toHavePrompt('Court Games');
                this.player2.clickPrompt('Honor a friendly character');
                expect(this.player1).toHavePrompt('Court Games');
                expect(this.player1).toBeAbleToSelect(this.fusuiDisciple);
                expect(this.player1).not.toBeAbleToSelect(this.asahinaStoryteller);
                this.player1.clickCard(this.fusuiDisciple);
                expect(this.fusuiDisciple.isHonored).toBe(true);
            });

            it('should trigger for Favored Niece', function() {
                this.player2.moveCard(this.honoredBlade, 'conflict deck');
                this.player2.clickCard('favored-niece');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.honoredBlade.location).toBe('hand');
            });

            it('should trigger for Fusui Disciple when only one player has the air ring', function() {
                this.player2.clickCard(this.fusuiDisciple);
                expect(this.player2).toHavePrompt('Choose a character to be honored or dishonored');
                this.player2.clickCard(this.fusuiDisciple);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Choose a character to be honored or dishonored');
            });

            it('should trigger for Fusui Disciple when both player have the air ring', function() {
                this.player1.claimRing('air');
                this.player2.clickCard(this.fusuiDisciple);
                expect(this.player2).toHavePrompt('Choose a player');
                this.player2.clickPrompt('player2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Choose a player');
                this.player1.clickPrompt('player1');
                expect(this.player1).toHavePrompt('Choose a character to be honored or dishonored');
            });

            it('should trigger for Kitsuki Investigator', function() {
                this.player2.clickCard(this.kitsukiInvestigator);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Kitsuki Investigator');
            });

            it('should trigger for Policy Debate', function() {
                this.player2.clickCard('policy-debate');
                this.player2.clickPrompt('Pay costs first');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Policy Debate');
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickCard(this.asahinaStoryteller);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Policy Debate');
                this.player1.clickPrompt('Fine Katana');
                expect(this.fineKatana.location).toBe('conflict discard pile');
            });

            it('should trigger for Prudent Challenger', function() {
                this.player2.pass();
                this.player1.playAttachment(this.fineKatana, this.asahinaStoryteller);
                this.player2.clickCard(this.prudentChallenger);
                this.player2.clickPrompt('Initiate a duel to discard attachment');
                this.player2.clickPrompt('Pay costs first');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Prudent Challenger');
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickCard(this.asahinaStoryteller);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Prudent Challnger');
                this.player1.clickCard(this.fineKatana);
                expect(this.fineKatana.location).toBe('conflict discard pile');
            });

            it('should trigger for Taryu-Jiai', function() {
                this.player2.clickCard('taryu-jiai');
                this.player2.clickPrompt('Pay costs first');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Taryu Jiai');
                this.player1.clickCard(this.fusuiDisciple);
                this.player1.clickCard(this.asahinaStoryteller);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Taryu Jiai');
                this.player1.clickRing('air');
                expect(this.player2).toHavePrompt('Air Ring');
            });

            it('should trigger for The Perfect Gift', function() {
                this.player2.clickCard('the-perfect-gift');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('The Perfect Gift');
            });

            it('should trigger for Upholding Authority', function() {
                this.asahinaStoryteller.honor();
                this.player2.pass();
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Hantei XXXVIII');
                this.player1.clickCard(this.kitsukiInvestigator);
                expect(this.kitsukiInvestigator.bowed).toBe(true);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('upholding-authority');
                this.player2.clickCard('upholding-authority');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player1).toHavePrompt('Upholding Authority');
                this.player1.clickPrompt('Bayushi Kachiko (2)');
                expect(this.player1).toHavePrompt('Upholding Authority');
                this.player1.clickPrompt('2');
            });

            it('should trigger for Utako Kamoko', function() {
                let handSize = this.player2.hand.size();
                this.asahinaStoryteller.honor();
                this.player2.pass();
                this.player1.clickCard(this.hantei);
                this.player1.clickCard(this.kitsukiInvestigator);
                expect(this.kitsukiInvestigator.bowed).toBe(true);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('upholding-authority');
                this.player2.pass();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.utakuKamoko);
                this.player2.clickCard(this.utakuKamoko);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hantei);
                this.player1.clickCard(this.hantei);
                expect(this.player2.hand.size()).toBe(handSize - 1);
                expect(this.utakuKamoko.bowed).toBe(false);
            });

            describe('whan Ambush is played', function() {
                it('should trigger when a scorpion character is visible', function() {
                    this.youngRumormonger = this.player2.placeCardInProvince('young-rumormonger');
                    this.player2.clickCard('ambush');
                    expect(this.player2).toHavePrompt('Ambush');
                    expect(this.player2).toBeAbleToSelect('bayushi-kachiko');
                    expect(this.player2).toBeAbleToSelect(this.youngRumormonger);
                    this.bayushiKachiko = this.player2.clickCard('bayushi-kachiko');
                    this.player2.clickPrompt('Done');
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.hantei);
                    this.player1.clickCard(this.hantei);
                    expect(this.player1).toHavePrompt('Ambush');
                    expect(this.player1).not.toBeAbleToSelect(this.bayushiKachiko);
                    expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                    this.player1.clickCard(this.youngRumormonger);
                    this.player1.clickCard('Done');
                    expect(this.youngRumormonger.location).toBe('play area');
                    expect(this.bayushiKachiko.location).toBe('hand');
                });

                it('should not trigger when no scorpion characters are visible', function() {
                    this.player2.clickCard('ambush');
                    expect(this.player2).toHavePrompt('Ambush');
                    expect(this.player2).toBeAbleToSelect('bayushi-kachiko');
                    this.bayushiKachiko = this.player2.clickCard('bayushi-kachiko');
                    this.player2.clickPrompt('Done');
                    expect(this.bayushiKachiko.location).toBe('play area');
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });

            describe('whan Duelist Training is triggered', function() {
                it('should allow Hantei to be used', function() {
                    let handSize = this.player2.hand.size();
                    this.player2.clickCard(this.prudentChallenger);
                    this.player2.clickPrompt('Initiate a duel to bow');
                    expect(this.player2).toHavePrompt('Prudent Challenger');
                    this.player2.clickCard(this.asahinaStoryteller);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.hantei);
                    this.player1.clickCard(this.hantei);
                    expect(this.player1).toHavePrompt('Prudent Challenger');
                    this.player1.clickCard(this.asahinaStoryteller);
                    this.player1.clickPrompt('1');
                    this.player2.clickPrompt('5');
                    expect(this.player2).toHavePromptButton('Pay with cards');
                    this.player2.clickPrompt('Pay with cards');
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    expect(this.player2.hand.size()).toBe(handSize - 4);
                });
            });

            describe('whan Time for War is played', function() {
                beforeEach(function() {
                    this.timeForWar = this.player2.moveCard('time-for-war', 'hand');
                    this.noMoreActions();
                });

                it('should allow Hantei to be triggered', function() {
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.timeForWar);
                    this.player1.clickCard(this.timeForWar);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.hantei);
                });
            });
        });
    });
});
