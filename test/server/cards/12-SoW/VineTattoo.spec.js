describe('Vine Tattoo', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'tengu-sensei', 'bayushi-yunako', 'isawa-atsuko', 'ikoma-ikehata'],
                    hand: ['duelist-training', 'vine-tattoo']
                },
                player2: {
                    inPlay: ['hantei-sotorii', 'master-alchemist'],
                    hand: ['vine-tattoo']
                }
            });

            this.shameful = this.player2.findCardByName('shameful-display', 'province 1');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.tengu = this.player1.findCardByName('tengu-sensei');
            this.yunako = this.player1.findCardByName('bayushi-yunako');
            this.atsuko = this.player1.findCardByName('isawa-atsuko');
            this.ikehata = this.player1.findCardByName('ikoma-ikehata');
            this.duelistTraining = this.player1.findCardByName('duelist-training');

            this.sotorii = this.player2.findCardByName('hantei-sotorii');
            this.masterAlchemist = this.player2.findCardByName('master-alchemist');
            this.vineTattoo = this.player2.findCardByName('vine-tattoo');

            this.vineTattooP1 = this.player1.findCardByName('vine-tattoo');

            this.player1.playAttachment(this.duelistTraining, this.atsuko);
            this.player2.playAttachment(this.vineTattoo, this.sotorii);
        });

        it('should add tattooed trait', function() {
            expect(this.sotorii.hasTrait('tattooed')).toBe(true);
        });

        it('should only be playable on characters you control', function() {
            this.player1.clickCard(this.vineTattooP1);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.tengu);
            expect(this.player1).toBeAbleToSelect(this.yunako);
            expect(this.player1).toBeAbleToSelect(this.atsuko);
            expect(this.player1).toBeAbleToSelect(this.ikehata);
            expect(this.player1).not.toBeAbleToSelect(this.sotorii);
            expect(this.player1).not.toBeAbleToSelect(this.masterAlchemist);
        });

        it('should be unable to be chosen by abilities from characters with equal or higher printed cost', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yunako],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.yunako);
            expect(this.player1).toBeAbleToSelect(this.yunako);
            expect(this.player1).not.toBeAbleToSelect(this.sotorii);
        });

        it('should be able to be chosen by abilities from characters with lower printed cost', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.masterAlchemist],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.sotorii);
            this.player1.clickCard(this.sotorii);
            expect(this.game.currentConflict.defenders).toContain(this.sotorii);
        });

        it('should be unable to be chosen by its own abilities', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.player2.clickCard(this.sotorii);
            expect(this.player2).not.toBeAbleToSelect(this.sotorii);
            expect(this.player2).toBeAbleToSelect(this.challenger);
        });

        it('should be unable to be chosen by gained abilities', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.atsuko],
                defenders: [this.sotorii, this.masterAlchemist],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.atsuko);
            expect(this.player1).not.toBeAbleToSelect(this.sotorii);
            expect(this.player1).toBeAbleToSelect(this.masterAlchemist);
        });

        it('should be unable to be chosen by other characters controlled by the same player', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.player2.clickCard(this.masterAlchemist);
            expect(this.player2).not.toBeAbleToSelect(this.sotorii);
            expect(this.player2).toBeAbleToSelect(this.challenger);
        });

        it('should not impact non-targeting keywords', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sotorii],
                type: 'military'
            });

            this.noMoreActions();
            expect(this.sotorii.isHonored).toBe(true);
        });

        it('should not impact abilities that don\'t target', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.sotorii],
                type: 'military',
                ring: 'void'
            });

            let mil = this.sotorii.getMilitarySkill();
            let pol = this.sotorii.getPoliticalSkill();

            this.player2.pass();
            this.player1.clickCard(this.atsuko);
            expect(this.sotorii.getMilitarySkill()).toBe(mil - 1);
            expect(this.sotorii.getPoliticalSkill()).toBe(pol - 1);
        });

        it('should be unable to be chosen by covert from characters with equal or higher printed cost', function() {
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.tengu);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Tengu Sensei');
            expect(this.player1).toBeAbleToSelect(this.masterAlchemist);
            expect(this.player1).not.toBeAbleToSelect(this.sotorii);
        });

        it('should be able to be chosen by covert from characters with lower printed cost', function() {
            this.noMoreActions();
            this.player1.clickRing('air');
            this.player1.clickCard(this.shameful);
            this.player1.clickCard(this.ikehata);
            this.player1.clickPrompt('Initiate Conflict');
            expect(this.player1).toHavePrompt('Choose covert target for Ikoma Ikehata');
            expect(this.player1).toBeAbleToSelect(this.masterAlchemist);
            expect(this.player1).toBeAbleToSelect(this.sotorii);
        });
    });
});
