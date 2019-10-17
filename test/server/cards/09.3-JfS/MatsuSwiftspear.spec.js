describe('Matsu Swiftspear', function() {
    integration(function() {
        describe('Matsu Swiftspear\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-swiftspear'],
                        hand: ['finger-of-jade', 'ornate-fan']
                    },
                    player2: {
                        hand: ['banzai']
                    }
                });

                this.matsuSwiftspear = this.player1.findCardByName('matsu-swiftspear');
                this.fingerOfJade = this.player1.findCardByName('finger-of-jade');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
            });

            it('should have no effect if you have more cards than your opponent', function() {
                expect(this.matsuSwiftspear.getMilitarySkill()).toBe(this.matsuSwiftspear.printedMilitarySkill);
            });

            it('should have no effect if you have the same number of cards as your opponent', function() {
                this.player1.playAttachment(this.fingerOfJade, this.matsuSwiftspear);
                expect(this.matsuSwiftspear.getMilitarySkill()).toBe(this.matsuSwiftspear.printedMilitarySkill);
            });

            it('should give matsu swiftspear +2 military if you have fewer cards than your opponent', function() {
                this.player1.playAttachment(this.fingerOfJade, this.matsuSwiftspear);
                this.player2.pass();
                this.player1.playAttachment(this.ornateFan, this.matsuSwiftspear);
                expect(this.matsuSwiftspear.getMilitarySkill()).toBe(this.matsuSwiftspear.printedMilitarySkill + 2);
            });
        });
    });
});

