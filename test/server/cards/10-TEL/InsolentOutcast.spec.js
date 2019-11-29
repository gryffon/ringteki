describe('InsolentOutcast', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['insolent-outcast', 'brash-samurai'],
                    hand: ['soul-beyond-reproach', 'way-of-the-crane']
                },
                player2: {
                    inPlay: ['wandering-ronin', 'doji-whisperer'],
                    hand: ['soul-beyond-reproach', 'way-of-the-crane']
                }
            });

            this.outcast = this.player1.findCardByName('insolent-outcast');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.ronin = this.player2.findCardByName('wandering-ronin');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('should start as a 1/1', function() {
            expect(this.outcast.getMilitarySkill()).toBe(1);
            expect(this.outcast.getPoliticalSkill()).toBe(1);
        });

        it('should increase skills by 1 for each honored character an opponent controls', function() {
            this.player1.pass();
            this.player2.clickCard('way-of-the-crane');
            this.player2.clickCard(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);
            expect(this.outcast.getMilitarySkill()).toBe(2);
            expect(this.outcast.getPoliticalSkill()).toBe(2);
            this.player1.pass();
            this.player2.clickCard('soul-beyond-reproach');
            this.player2.clickCard(this.ronin);
            expect(this.ronin.isHonored).toBe(true);
            expect(this.outcast.getMilitarySkill()).toBe(3);
            expect(this.outcast.getPoliticalSkill()).toBe(3);
        });

        it('should not increase skills for friendly honored characters', function() {
            this.player1.clickCard('way-of-the-crane');
            this.player1.clickCard(this.brash);
            expect(this.brash.isHonored).toBe(true);
            expect(this.outcast.getMilitarySkill()).toBe(1);
            expect(this.outcast.getPoliticalSkill()).toBe(1);
            this.player2.pass();
            this.player1.clickCard('soul-beyond-reproach');
            this.player1.clickCard(this.outcast);
            expect(this.outcast.isHonored).toBe(true);
            expect(this.outcast.getMilitarySkill()).toBe(1);
            expect(this.outcast.getPoliticalSkill()).toBe(1);
        });
    });
});
