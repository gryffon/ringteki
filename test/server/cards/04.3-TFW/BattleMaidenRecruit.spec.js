describe('Battle Maiden Recruit', function() {
    integration(function() {
        describe('Battle Maiden Recruit\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['battle-maiden-recruit']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.maiden = this.player1.findCardByName('battle-maiden-recruit');
                this.noMoreActions();
            });

            function worksWithRing(ringType) {
                it('should give +2 to military skill if the ' + ringType + ' ring is claimed',
                    function() {
                        let military = this.maiden.getMilitarySkill();
                        this.game.rings[ringType].claimRing(this.player1.player);
                        this.game.checkGameState(true);
                        expect(this.maiden.getMilitarySkill()).toBe(military + 2);
                    }
                );
            }

            for(let ringType of ['water', 'void']) {
                worksWithRing(ringType);
            }

            function doesntWorkWithRing(ringType) {
                it('should not give +2 to military skill if the ' + ringType + ' ring is claimed',
                    function() {
                        let military = this.maiden.getMilitarySkill();
                        this.game.rings[ringType].claimRing(this.player1.player);
                        this.game.checkGameState(true);
                        expect(this.maiden.getMilitarySkill()).toBe(military);
                    }
                );
            }

            for(let ringType of ['air', 'earth', 'fire']) {
                doesntWorkWithRing(ringType);
            }

            it('should not give +2 to military skill if the opponent claimed the air or water ring', function() {
                let military = this.maiden.getMilitarySkill();
                this.game.rings.air.claimRing(this.player2.player);
                this.game.rings.water.claimRing(this.player2.player);
                this.game.checkGameState(true);
                expect(this.maiden.getMilitarySkill()).toBe(military);
            });
        });
    });
});
