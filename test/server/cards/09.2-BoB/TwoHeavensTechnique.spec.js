describe('Two-Heavens Technique', function() {
    integration(function() {
        describe('Two-Heavens Technique', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['two-heavens-technique', 'fine-katana', 'pathfinder-s-blade', 'ornate-fan', 'kakita-blade']
                    },
                    player2: {
                        inPlay: ['matsu-berserker']
                    }
                });
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.twoHeavensTechnique = this.player1.findCardByName('two-heavens-technique');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.pathfindersBlade = this.player1.findCardByName('pathfinder-s-blade');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.kakitaBlade = this.player1.findCardByName('kakita-blade');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            });

            it('should only be attachable to bushi characters', function() {
                this.player1.clickCard(this.twoHeavensTechnique);
                expect(this.player1).toBeAbleToSelect(this.brashSamurai);
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
            });

            it('should not give covert when the character has 1 or fewer weapons attached', function() {
                this.player1.clickCard(this.twoHeavensTechnique);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isCovert()).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isCovert()).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.ornateFan);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isCovert()).toBe(false);
            });

            it('should not give covert when the character has 3 or more weapons attached', function() {
                this.player1.clickCard(this.twoHeavensTechnique);
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.clickCard(this.pathfindersBlade);
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.clickCard(this.kakitaBlade);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isCovert()).toBe(false);
            });

            it('should give covert when the character has 2 weapons attached', function() {
                this.player1.clickCard(this.twoHeavensTechnique);
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.clickCard(this.fineKatana);
                this.player1.clickCard(this.brashSamurai);
                this.player2.pass();
                this.player1.clickCard(this.kakitaBlade);
                this.player1.clickCard(this.brashSamurai);
                expect(this.brashSamurai.isCovert()).toBe(true);
            });
        });
    });
});
