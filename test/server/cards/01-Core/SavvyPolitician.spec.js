describe('Savvy Politician', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        {
                            card: 'Savvy Politician',
                            attachments: ['Magnificent Kimono']
                        },
                        'Keeper Initiate'
                    ]
                }
            });
            this.politician = this.player1.findCardByName('Savvy Politician', 'play area');
            this.noMoreActions();
        });

        describe('when the politician is not honored', function() {
            it('should trigger its ability when it becomes honored', function() {
                this.initiateConflict({
                    attackers: ['Savvy Politician'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });
        });

        describe('when the politician is already honored', function() {
            beforeEach(function() {
                this.politician.honor();
            });

            it('should not trigger its ability when winning a conflic', function() {
                this.initiateConflict({
                    attackers: ['Savvy Politician'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });
        });
    });
});
