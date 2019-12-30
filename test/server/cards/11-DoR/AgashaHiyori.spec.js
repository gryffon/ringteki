describe('Agasha Hiyori', function() {
    integration(function() {
        describe('Agasha Hiyori\'s ability (phase checks)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['agasha-hiyori'],
                        hand: ['court-mask']
                    }
                });
                this.agashaHiyori = this.player1.findCardByName('agasha-hiyori');
                this.courtMask = this.player1.findCardByName('court-mask');
                this.agashaHiyori.fate = 2;

                this.player1.playAttachment(this.courtMask, this.agashaHiyori);
            });

            it('should trigger at the start of any phase', function() {
                this.noMoreActions(); // fate phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                this.noMoreActions(); // dynasty phase
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickPrompt('Pass');

                this.noMoreActions();// draw phase
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // conflict phase
                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // fate phase
                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickPrompt('Pass');
                this.noMoreActions();
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('End Round');
                this.player2.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.courtMask.location).toBe('play area');
                expect(this.agashaHiyori.location).toBe('play area');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
            });
        });

        describe('Agasha Hiyori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['agasha-hiyori'],
                        hand: ['court-mask', 'fine-katana'],
                        honor: 6
                    },
                    player2: {
                        inPlay: ['doomed-shugenja', 'brash-samurai'],
                        hand: ['cloud-the-mind', 'watch-commander', 'greater-understanding', 'let-go']
                    }
                });
                this.agashaHiyori = this.player1.findCardByName('agasha-hiyori');
                this.katana = this.player1.findCardByName('fine-katana');
                this.courtMask = this.player1.findCardByName('court-mask');
                this.agashaHiyori.fate = 1;

                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.cloud = this.player2.findCardByName('cloud-the-mind');
                this.greaterUnderstanding = this.player2.findCardByName('greater-understanding');
                this.watchCommander = this.player2.findCardByName('watch-commander');
                this.letGo = this.player2.findCardByName('let-go');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.playAttachment(this.courtMask, this.agashaHiyori);
                this.player2.playAttachment(this.cloud, this.brashSamurai);
                this.player1.pass();
                this.player2.playAttachment(this.watchCommander, this.brashSamurai);
                this.player1.pass();
                this.player1.claimRing('water');
                this.player2.clickCard(this.greaterUnderstanding);
                this.player2.clickRing('fire');

                this.noMoreActions();
            });

            it('should target attachments on characters', function() {
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.courtMask);
                expect(this.player1).toBeAbleToSelect(this.cloud);
                expect(this.player1).toBeAbleToSelect(this.watchCommander);
                expect(this.player1).not.toBeAbleToSelect(this.greaterUnderstanding);
                expect(this.player1).not.toBeAbleToSelect(this.katana);
            });


            it('should pay fate to an unclaimed ring', function() {
                let airFate = this.game.rings.air.fate;
                let playerFate = this.player1.fate;

                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.courtMask);
                this.player1.clickCard(this.courtMask);
                expect(this.player1).toHavePrompt('Select a ring to place fate on');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).not.toBeAbleToSelectRing('water');
                expect(this.player1).toBeAbleToSelectRing('void');

                this.player1.clickRing('air');
                expect(this.game.rings.air.fate).toBe(airFate + 1);
                expect(this.player1.fate).toBe(playerFate - 1);

                expect(this.getChatLogs(1)).toContain('player1 uses Agasha Hiyori, placing  fate on Air Ring to treat Court Mask as if its printed text box were blank and as if it had no skill modifiers until the end of the phase');
            });

            it('should remove skill bonuses on attachments', function() {
                expect(this.agashaHiyori.getMilitarySkill()).not.toBe(this.agashaHiyori.getBaseMilitarySkill());
                expect(this.agashaHiyori.getPoliticalSkill()).not.toBe(this.agashaHiyori.getBasePoliticalSkill());

                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.courtMask);
                this.player1.clickCard(this.courtMask);
                this.player1.clickRing('air');

                expect(this.agashaHiyori.getMilitarySkill()).toBe(this.agashaHiyori.getBaseMilitarySkill());
                expect(this.agashaHiyori.getPoliticalSkill()).toBe(this.agashaHiyori.getBasePoliticalSkill());
            });

            it('should only remove skill bonuses on targetted attachments', function() {
                expect(this.brashSamurai.getMilitarySkill()).not.toBe(this.brashSamurai.getBaseMilitarySkill());
                expect(this.brashSamurai.getPoliticalSkill()).not.toBe(this.brashSamurai.getBasePoliticalSkill());

                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.cloud);
                this.player1.clickCard(this.cloud);
                this.player1.clickRing('air');

                expect(this.brashSamurai.getMilitarySkill()).toBe(this.brashSamurai.getBaseMilitarySkill() + 1);
                expect(this.brashSamurai.getPoliticalSkill()).toBe(this.brashSamurai.getBasePoliticalSkill() + 1);
            });

            it('should remove action abilities', function() {
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.courtMask);
                this.player1.clickCard(this.courtMask);
                this.player1.clickRing('air');

                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.courtMask);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.courtMask.location).toBe('play area');
                expect(this.agashaHiyori.isDishonored).toBe(false);
            });

            it('should remove constant abilities', function() {
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.cloud);
                this.player1.clickCard(this.cloud);
                this.player1.clickRing('air');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaHiyori],
                    defenders: [this.brashSamurai]
                });
                expect(this.brashSamurai.isHonored).toBe(false);
                this.player2.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(true);
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.watchCommander);
                let honor = this.player1.honor;
                this.player2.clickCard(this.watchCommander);
                expect(this.player1.honor).toBe(honor - 1);
            });

            it('should remove reaction abilities', function() {
                expect(this.player1).toBeAbleToSelect(this.agashaHiyori);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player1).toBeAbleToSelect(this.watchCommander);
                this.player1.clickCard(this.watchCommander);
                this.player1.clickRing('air');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.agashaHiyori],
                    defenders: [this.brashSamurai]
                });
                expect(this.brashSamurai.isHonored).toBe(false);
                this.player2.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isHonored).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.agashaHiyori);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player2).not.toBeAbleToSelect(this.watchCommander);
                let honor = this.player1.honor;
                this.player2.clickCard(this.watchCommander);
                expect(this.player1.honor).toBe(honor);
            });
        });
    });
});

