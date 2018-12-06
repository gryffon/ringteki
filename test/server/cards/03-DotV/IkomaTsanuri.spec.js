describe('Ikoma Tsanuri', function() {
    integration(function() {
        describe('Ikoma Tsanuri\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-tsanuri', 'matsu-berserker', 'kitsu-warrior', 'obstinate-recruit', 'kitsu-spiritcaller']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });
                this.ikomaTsanuri = this.player1.findCardByName('ikoma-tsanuri');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.kitsuWarrior = this.player1.findCardByName('kitsu-warrior');
                this.obstinateRecruit = this.player1.findCardByName('obstinate-recruit');
                this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');

                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            });

            it('should not trigger when you do not have 3 bushi participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ikomaTsanuri, this.matsuBerserker, this.kitsuSpiritcaller],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ikomaTsanuri);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if Ikoma Tsanuri is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker, this.kitsuWarrior, this.obstinateRecruit],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ikomaTsanuri);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger when you have 3 bushi participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ikomaTsanuri, this.matsuBerserker, this.obstinateRecruit],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ikomaTsanuri);
                expect(this.player1).not.toHavePrompt('Conflict Action Window');
            });

            it('should give +1/+1 to all participating characters you control until the end of the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ikomaTsanuri, this.matsuBerserker, this.obstinateRecruit, this.kitsuSpiritcaller],
                    defenders: [this.dojiWhisperer]
                });
                this.player2.pass();

                let ikomaTsanuriMil = this.ikomaTsanuri.militarySkill;
                let ikomaTsanuriPol = this.ikomaTsanuri.politicalSkill;
                let matsuBerserkerMil = this.matsuBerserker.militarySkill;
                let matsuBerserkerPol = this.matsuBerserker.politicalSkill;
                let obstinateRecruitMil = this.obstinateRecruit.militarySkill;
                let obstinateRecruitPol = this.obstinateRecruit.politicalSkill;
                let kitsuSpiritcallerMil = this.kitsuSpiritcaller.militarySkill;
                let kitsuSpiritcallerPol = this.kitsuSpiritcaller.politicalSkill;
                let dojiWhispererMil = this.dojiWhisperer.militarySkill;
                let dojiWhispererPol = this.dojiWhisperer.politicalSkill;

                this.player1.clickCard(this.ikomaTsanuri);

                expect(this.ikomaTsanuri.militarySkill).toBe(ikomaTsanuriMil + 1);
                expect(this.ikomaTsanuri.politicalSkill).toBe(ikomaTsanuriPol + 1);
                expect(this.matsuBerserker.militarySkill).toBe(matsuBerserkerMil + 1);
                expect(this.matsuBerserker.politicalSkill).toBe(matsuBerserkerPol); // dash ability so no +1
                expect(this.obstinateRecruit.militarySkill).toBe(obstinateRecruitMil + 1);
                expect(this.obstinateRecruit.politicalSkill).toBe(obstinateRecruitPol + 1);
                expect(this.kitsuSpiritcaller.militarySkill).toBe(kitsuSpiritcallerMil + 1);
                expect(this.kitsuSpiritcaller.politicalSkill).toBe(kitsuSpiritcallerPol + 1);
                expect(this.dojiWhisperer.militarySkill).toBe(dojiWhispererMil);
                expect(this.dojiWhisperer.politicalSkill).toBe(dojiWhispererPol);

                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('Yes');
                this.player1.clickPrompt('Don\'t Resolve');

                expect(this.ikomaTsanuri.militarySkill).toBe(ikomaTsanuriMil);
                expect(this.ikomaTsanuri.politicalSkill).toBe(ikomaTsanuriPol);
                expect(this.matsuBerserker.militarySkill).toBe(matsuBerserkerMil);
                expect(this.matsuBerserker.politicalSkill).toBe(matsuBerserkerPol);
                expect(this.obstinateRecruit.militarySkill).toBe(obstinateRecruitMil);
                expect(this.obstinateRecruit.politicalSkill).toBe(obstinateRecruitPol);
                expect(this.kitsuSpiritcaller.militarySkill).toBe(kitsuSpiritcallerMil);
                expect(this.kitsuSpiritcaller.politicalSkill).toBe(kitsuSpiritcallerPol);
                expect(this.dojiWhisperer.militarySkill).toBe(dojiWhispererMil);
                expect(this.dojiWhisperer.politicalSkill).toBe(dojiWhispererPol);
            });
        });
    });
});
