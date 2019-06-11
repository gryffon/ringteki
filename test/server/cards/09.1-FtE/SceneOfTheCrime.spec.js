describe('Scene of the Crime', function() {
    integration(function() {
        describe('During a conflict where the opponent has cards in their hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['way-of-the-lion', 'a-legion-of-one', 'banzai']
                    },
                    player2: {
                        provinces: ['scene-of-the-crime']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.wayOfTheLion = this.player1.findCardByName('way-of-the-lion');
                this.aLegionOfOne = this.player1.findCardByName('a-legion-of-one');
                this.banzai = this.player1.findCardByName('banzai');
                this.sceneOfTheCrime = this.player2.findCardByName('scene-of-the-crime');
                this.spy = spyOn(this.game, 'addMessage');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker]
                });
            });

            it('should trigger after being revealed', function () {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.sceneOfTheCrime);
            });

            it('should show the opponent\'s hand in the chatlog', function () {
                this.player2.clickCard(this.sceneOfTheCrime);
                expect(this.spy).toHaveBeenCalledWith('{0} sees {1}', this.sceneOfTheCrime, [this.aLegionOfOne, this.banzai, this.wayOfTheLion]);
            });
        });

        describe('During a conflict where the opponent has no cards in their hand', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: []
                    },
                    player2: {
                        provinces: ['scene-of-the-crime']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

                this.sceneOfTheCrime = this.player2.findCardByName('scene-of-the-crime');

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker]
                });
            });

            it('should not be able to be triggered', function () {
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.sceneOfTheCrime);
            });
        });
    });
});

