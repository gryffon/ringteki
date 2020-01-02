describe('Monastery Protector', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['monastery-protector', 'doji-challenger', 'ancient-master'],
                    hand: ['hawk-tattoo']
                },
                player2: {
                    fate: 0,
                    inPlay: ['doji-kuwanan', 'awakened-tsukumogami'],
                    hand: ['way-of-the-scorpion', 'hurricane-punch', 'mark-of-shame', 'unfulfilled-duty'],
                    dynastyDiscard: ['city-of-lies']
                }
            });

            this.protector = this.player1.findCardByName('monastery-protector');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.tattoo = this.player1.findCardByName('hawk-tattoo');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.scorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.hurricanePunch = this.player2.findCardByName('hurricane-punch');
            this.shame = this.player2.findCardByName('mark-of-shame');
            this.duty = this.player2.findCardByName('unfulfilled-duty');
            this.lies = this.player2.placeCardInProvince('city-of-lies', 'province 1');
        });

        it('should not allow targeting if you cannot pay a fate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion);
            expect(this.player2).not.toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);
        });

        it('should not allow playing a card if it would have no legal targets', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.kuwanan],
                type: 'military'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should only allow targeting tattooed characters equal to the amount of fate that you have', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).not.toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });

        it('should account for reduced cost', function() {
            this.player2.fate = 3;
            this.protector.bowed = true;
            this.ancientMaster.bowed = true;

            this.player1.pass();
            this.player2.clickCard(this.lies);
            this.player1.pass();
            this.player2.clickCard(this.duty);

            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);

            this.player2.clickCard(this.protector);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });

        it('should allow for using alternate fate pools', function() {
            this.game.rings.air.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.protector, this.challenger, this.ancientMaster],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.hurricanePunch);
            expect(this.player2).toBeAbleToSelect(this.protector);
            expect(this.player2).toBeAbleToSelect(this.ancientMaster);
        });
    });
});