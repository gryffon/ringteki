describe('Moto Ariq', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['moto-ariq', 'utaku-infantry']
                },
                player2: {
                    honor: 13,
                    inPlay: ['ikoma-ujiaki', 'matsu-berserker'],
                    hand: ['assassination']
                }
            });

            this.motoAriq = this.player1.findCardByName('moto-ariq');
            this.utakuInfantry = this.player1.findCardByName('utaku-infantry');
            this.assassination = this.player2.findCardByName('assassination');
            this.ikomaUjiaki = this.player2.findCardByName('ikoma-ujiaki');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.matsuBerserker.bow();
        });

        it('should pull a ready opposing character of their choice', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoAriq],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.motoAriq);
            expect(this.player2).toHavePrompt('Choose a character to move to the conflict');
            this.player2.clickCard(this.ikomaUjiaki);
            expect(this.ikomaUjiaki.isParticipating()).toBe(true);
        });

        it('should not allow a bowed character to be pulled', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoAriq],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.motoAriq);
            this.player2.clickCard(this.matsuBerserker);
            expect(this.matsuBerserker.isParticipating()).toBe(false);
        });

        it('should not allow a friendly character to be pulled', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoAriq],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.motoAriq);
            this.player2.clickCard(this.utakuInfantry);
            expect(this.utakuInfantry.isParticipating()).toBe(false);
        });

        it('should not work when more/equally honorable', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoAriq],
                defenders: []
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.utakuInfantry);
            this.player1.clickCard(this.motoAriq);
            this.player2.clickCard(this.ikomaUjiaki);
            expect(this.ikomaUjiaki.isParticipating()).toBe(false);
        });
    });
});
