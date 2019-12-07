describe('Inferno Guard Invoker', function() {
    integration(function() {
        describe('Inferno Guard Invoker\'s action ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['inferno-guard-invoker', 'serene-warrior']
                    },
                    player2: {
                        inPlay: ['solemn-scholar', 'fushicho']
                    }
                });

                this.infernoGuardInvoker = this.player1.findCardByName('inferno-guard-invoker');
                this.sereneWarrior = this.player1.findCardByName('serene-warrior');

                this.solemnScholar = this.player2.findCardByName('solemn-scholar');
                this.fushicho = this.player2.findCardByName('fushicho');

                this.noMoreActions();
            });

            it('should not be triggerable during a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.sereneWarrior],
                    defenders: [this.solemnScholar]
                });

                this.player2.pass();

                this.player1.clickCard(this.infernoGuardInvoker);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should be able to honor a participating character you control during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sereneWarrior],
                    defenders: [this.solemnScholar]
                });

                this.player2.pass();

                this.player1.clickCard(this.infernoGuardInvoker);
                expect(this.player1).toBeAbleToSelect(this.sereneWarrior);
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
                expect(this.player1).not.toBeAbleToSelect(this.infernoGuardInvoker);
                expect(this.player1).not.toBeAbleToSelect(this.fushicho);

                this.player1.clickCard(this.sereneWarrior);
                expect(this.sereneWarrior.isHonored).toBe(true);
            });

            it('should sacrifice the targeted character if the province breaks this conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sereneWarrior],
                    defenders: [this.solemnScholar]
                });

                this.player2.pass();

                this.player1.clickCard(this.infernoGuardInvoker);
                expect(this.player1).toBeAbleToSelect(this.sereneWarrior);
                expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
                expect(this.player1).not.toBeAbleToSelect(this.infernoGuardInvoker);

                this.player1.clickCard(this.sereneWarrior);
                expect(this.sereneWarrior.isHonored).toBe(true);

                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('No');
                expect(this.getChatLogs(5)).toContain('Serene Warrior is discarded, burned to a pile of ash due to the delayed effect of Inferno Guard Invoker');
                expect(this.sereneWarrior.location).toBe('dynasty discard pile');
            });

            it('should not discard the targeted character if the province doesn\'t break this conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sereneWarrior],
                    defenders: [this.fushicho]
                });

                this.player2.pass();

                this.player1.clickCard(this.infernoGuardInvoker);
                this.player1.clickCard(this.sereneWarrior);
                expect(this.sereneWarrior.isHonored).toBe(true);

                this.player2.pass();
                this.player1.pass();

                expect(this.getChatLogs(5)).not.toContain('Serene Warrior is discarded, burned to a pile of ash due to the delayed effect of Inferno Guard Invoker');
                this.player1.clickPrompt('Don\'t Resolve');

                expect(this.sereneWarrior.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
