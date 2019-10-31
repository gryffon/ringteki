describe('Miyako\'s Undertaking', function() {
    integration(function() {
        describe('Miyako\'s Undertaking\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'bayushi-kachiko', 'young-rumormonger', 'alibi-artist', 'shosuro-sadako'],
                        honor: 5,
                        hand: ['miyako-s-undertaking', 'miyako-s-undertaking', 'way-of-the-scorpion', 'fine-katana', 'bayushi-kachiko'],
                        dynastyDiscard: ['shosuro-actress']
                    },
                    player2: {
                        hand: ['assassination'],
                        inPlay: ['doomed-shugenja', 'kitsuki-investigator'],
                        dynastyDiscard: ['kitsu-spiritcaller', 'implacable-magistrate', 'akodo-gunso', 'niten-master', 'ikoma-ujiaki', 'matsu-berserker']
                    }
                });

                this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
                this.bayushiKachiko = this.player1.findCardByName('bayushi-kachiko');
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                this.alibiArtist = this.player1.findCardByName('alibi-artist');
                this.shosuroSadako = this.player1.findCardByName('shosuro-sadako');
                this.kitsuSpiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
                this.implacableMagistrate = this.player2.findCardByName('implacable-magistrate');
                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
                this.nitenMaster = this.player2.findCardByName('niten-master');
                this.ikomaUjiaki = this.player2.findCardByName('ikoma-ujiaki');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');

                this.shosuroSadako.dishonor();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-liar', 'bayushi-kachiko', 'young-rumormonger', 'shosuro-sadako'],
                    defenders: [this.doomedShugenja]
                });
                this.player2.pass();
            });

            it('should copy all attributes (except uniqueness) of the chosen card', function() {
                this.player1.clickCard('miyako-s-undertaking');
                expect(this.player1).toHavePrompt('Miyako\'s Undertaking');
                expect(this.player1).toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player1).toBeAbleToSelect(this.implacableMagistrate);
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).toBeAbleToSelect(this.nitenMaster);
                expect(this.player1).not.toBeAbleToSelect(this.ikomaUjiaki);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).not.toBeAbleToSelect(this.bayushiKachiko);
                expect(this.player1).not.toBeAbleToSelect(this.youngRumormonger);
                expect(this.player1).not.toBeAbleToSelect(this.shosuroSadako);
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                this.player1.clickCard(this.kitsuSpiritcaller);
                expect(this.player1).toHavePrompt('Miyako\'s Undertaking');
                expect(this.player1).not.toBeAbleToSelect(this.kitsuSpiritcaller);
                expect(this.player1).not.toBeAbleToSelect(this.implacableMagistrate);
                expect(this.player1).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).not.toBeAbleToSelect(this.nitenMaster);
                expect(this.player1).not.toBeAbleToSelect(this.ikomaUjiaki);
                expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
                expect(this.player1).toBeAbleToSelect(this.bayushiKachiko);
                expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                expect(this.player1).toBeAbleToSelect(this.shosuroSadako);
                expect(this.player1).not.toBeAbleToSelect(this.alibiArtist);
                this.player1.clickCard(this.bayushiKachiko);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.bayushiKachiko.name).toBe(this.kitsuSpiritcaller.name);
                expect(this.bayushiKachiko.getCost()).toBe(this.kitsuSpiritcaller.getCost());
                expect(this.bayushiKachiko.getBaseMilitarySkill()).toBe(this.kitsuSpiritcaller.printedMilitarySkill);
                expect(this.bayushiKachiko.getPoliticalSkill()).toBe(this.kitsuSpiritcaller.printedPoliticalSkill);
                expect(this.bayushiKachiko.getTraits()).toContain('shugenja');
                expect(this.bayushiKachiko.getTraits()).toContain('water');
                expect(this.bayushiKachiko.isUnique()).toBe(true);
            });

            it('should not permit playing a new copy of the character if it\'s unique', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.kitsuSpiritcaller);
                this.player1.clickCard(this.bayushiKachiko);
                this.player2.pass();
                this.player1.clickCard('bayushi-kachiko', 'hand');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should expire at the end of the conflict', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.kitsuSpiritcaller);
                this.player1.clickCard(this.bayushiKachiko);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.bayushiKachiko.name).toBe(this.bayushiKachiko.printedName);
                expect(this.bayushiKachiko.getCost()).toBe(this.bayushiKachiko.printedCost);
                expect(this.bayushiKachiko.getBaseMilitarySkill()).toBe(this.bayushiKachiko.printedMilitarySkill);
                expect(this.bayushiKachiko.getPoliticalSkill()).toBe(this.bayushiKachiko.printedPoliticalSkill);
                expect(this.bayushiKachiko.getTraits()).toContain('courtier');
                expect(this.bayushiKachiko.getTraits()).toContain('imperial');
                expect(this.bayushiKachiko.isUnique()).toBe(true);
            });

            it('should remove any action abilities, and copy them from the target', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.kitsuSpiritcaller);
                this.player1.clickCard(this.bayushiKachiko);
                this.player2.pass();
                this.player1.clickCard(this.bayushiKachiko);
                expect(this.player1).toHavePrompt('Kitsu Spiritcaller');
                expect(this.player1).toBeAbleToSelect('shosuro-actress');
                this.shosuroActress = this.player1.clickCard('shosuro-actress');
                expect(this.shosuroActress.location).toBe('play area');
            });

            it('should remove any reaction abilities, and copy them from the target', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.nitenMaster);
                this.player1.clickCard(this.youngRumormonger);
                this.player2.pass();
                this.player1.clickCard('way-of-the-scorpion');
                expect(this.player1).toHavePrompt('Way of the Scorpion');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.pass();
                this.player1.clickCard(this.bayushiKachiko);
                this.player1.clickCard(this.youngRumormonger);
                this.player1.clickPrompt('Yes');
                expect(this.youngRumormonger.bowed).toBe(true);
                this.player2.pass();
                this.player1.playAttachment('fine-katana', this.youngRumormonger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                this.player1.clickCard(this.youngRumormonger);
                expect(this.youngRumormonger.bowed).toBe(false);
            });

            it('should remove any persistent effects, and copy them from the target', function() {
                expect(this.shosuroSadako.militarySkill).toBe(4);
                expect(this.game.currentConflict.attackerSkill).toBe(15);
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.implacableMagistrate);
                this.player1.clickCard(this.shosuroSadako);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.shosuroSadako.militarySkill).toBe(1);
                expect(this.game.currentConflict.attackerSkill).toBe(1);
            });

            it('should remove any keywords', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickCard(this.bayushiLiar);
                let handSize = this.player1.player.hand.size();
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.bayushiLiar);
                expect(this.player1.player.hand.size()).toBe(handSize);
            });

            it('should add any relevant keywords', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickCard(this.bayushiLiar);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Any interrupts to Akodo Gunsō being honored?');
            });

            it('should allow dashes to be changed', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.militarySkill).toBe(2);
            });

            it('should correctly copy the most recent effect', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.kitsuSpiritcaller);
                this.player1.clickCard(this.bayushiKachiko);
                this.player2.pass();
                this.player1.clickCard('miyako-s-undertaking', 'hand');
                this.player1.clickCard(this.implacableMagistrate);
                this.player1.clickCard(this.bayushiKachiko);
                this.player2.pass();
                this.player1.clickCard(this.bayushiKachiko);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.bayushiKachiko.name).toBe(this.implacableMagistrate.name);
                expect(this.bayushiKachiko.getCost()).toBe(this.implacableMagistrate.getCost());
                expect(this.bayushiKachiko.getBaseMilitarySkill()).toBe(this.implacableMagistrate.printedMilitarySkill);
                expect(this.bayushiKachiko.getPoliticalSkill()).toBe(this.implacableMagistrate.printedPoliticalSkill);
                expect(this.bayushiKachiko.getTraits()).not.toContain('courtier');
                expect(this.bayushiKachiko.getTraits()).not.toContain('shugenja');
                expect(this.bayushiKachiko.getTraits()).not.toContain('water');
                expect(this.bayushiKachiko.getTraits()).toContain('bushi');
                expect(this.bayushiKachiko.getTraits()).toContain('imperial');
                expect(this.bayushiKachiko.getTraits()).toContain('magistrate');
                expect(this.bayushiKachiko.isUnique()).toBe(true);
                expect(this.game.currentConflict.attackerSkill).toBe(2);
            });

            it('should only allow reactions to trigger if they are currently being copied', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.nitenMaster);
                this.player1.clickCard(this.youngRumormonger);
                this.player2.pass();
                this.player1.clickCard('miyako-s-undertaking', 'hand');
                this.player1.clickCard(this.implacableMagistrate);
                this.player1.clickCard(this.youngRumormonger);
                this.player2.pass();
                this.player1.clickCard(this.bayushiKachiko);
                this.player1.clickCard(this.youngRumormonger);
                this.player1.clickPrompt('Yes');
                expect(this.youngRumormonger.bowed).toBe(true);
                this.player2.pass();
                this.player1.playAttachment('fine-katana', this.youngRumormonger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should copy dash skills', function() {
                this.player1.clickCard('miyako-s-undertaking');
                this.player1.clickCard(this.matsuBerserker);
                this.player1.clickCard(this.bayushiLiar);
                expect(this.bayushiLiar.hasDash('political')).toBe(true);
            });
        });
    });
});
