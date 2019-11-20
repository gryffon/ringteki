describe('Festival of the Departed', function() {
    integration(function() {
        describe('Festival of the Departed\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer', 'iuchi-wayfinder', 'wandering-ronin'],
                        hand: ['challenge-on-the-fields', 'a-perfect-cut', 'speak-to-the-heart']
                    },
                    player2: {
                        inPlay: ['tattooed-wanderer', 'agasha-swordsmith', 'matsu-berserker'],
                        hand: ['hurricane-punch', 'banzai', 'way-of-the-lion', 'talisman-of-the-sun'],
                        provinces: ['festival-of-the-departed']
                    }
                });

                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.iuchiWayfinder = this.player1.findCardByName('iuchi-wayfinder');
                this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
                this.wanderingRonin.fate = 2;
                this.challengeOnTheFields = this.player1.findCardByName('challenge-on-the-fields');
                this.aPerfectCut = this.player1.findCardByName('a-perfect-cut');
                this.speakToTheHeart = this.player1.findCardByName('speak-to-the-heart');

                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.hurricanePunch = this.player2.findCardByName('hurricane-punch');
                this.banzai = this.player2.findCardByName('banzai');
                this.wayOfTheLion = this.player2.findCardByName('way-of-the-lion');
                this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');
                this.festivalOfTheDeparted = this.player2.findCardByName('festival-of-the-departed');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            });

            it('should prevent characters from increasing their military skill (+X modifiers)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer]
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.banzai);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prevent characters from increasing their military skill (base +X modifiers)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.matsuBerserker]
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.wayOfTheLion);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prevent characters from increasing their political skill', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.iuchiWayfinder],
                    defenders: [this.tattooedWanderer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.speakToTheHeart);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow the duel from Challenge on the Fields, but not apply the skill modifier', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai, this.dojiWhisperer],
                    defenders: [this.tattooedWanderer, this.agashaSwordsmith]
                });
                this.player2.pass();
                this.player1.clickCard(this.challengeOnTheFields);
                this.player1.clickCard(this.brashSamurai);
                this.player1.clickCard(this.tattooedWanderer);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(4)).toContain('Brash Samurai: 4 vs 3: Tattooed Wanderer');
            });

            it('should allow A Perfect Cut to setup the delayed honoring, but not apply the skill modifier', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer]
                });
                this.player2.pass();
                expect(this.brashSamurai.getMilitarySkill()).toBe(2);
                this.player1.clickCard(this.aPerfectCut);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.getMilitarySkill()).toBe(2);
                this.noMoreActions();
                expect(this.brashSamurai.isHonored).toBe(true);
            });

            it('should not allow Hurricane Punch to be triggered', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer]
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.hurricanePunch);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not keep existing modifiers in place if moved to Festival', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.brashSamurai],
                    defenders: [this.tattooedWanderer, this.matsuBerserker],
                    province: this.shamefulDisplay
                });
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.tattooedWanderer);
                this.player1.clickCard(this.aPerfectCut);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.getMilitarySkill()).toBe(4);
                this.player2.clickCard(this.wayOfTheLion);
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.getMilitarySkill()).toBe(6);
                this.player1.pass();
                this.player2.clickCard(this.talismanOfTheSun);
                this.player2.clickCard(this.festivalOfTheDeparted);
                expect(this.game.currentConflict.conflictProvince).toBe(this.festivalOfTheDeparted);
                expect(this.brashSamurai.getMilitarySkill()).toBe(2);
                expect(this.matsuBerserker.getMilitarySkill()).toBe(3);
            });

            it('should not suppress modifiers from character abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.wanderingRonin],
                    defenders: [this.tattooedWanderer, this.matsuBerserker],
                    province: this.festivalOfTheDeparted
                });
                this.player2.pass();
                this.player1.clickCard(this.wanderingRonin);
                expect(this.wanderingRonin.militarySkill).toBe(4);
            });
        });
    });
});
