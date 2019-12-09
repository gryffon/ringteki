describe('Inferno Guard Invoker', function() {
    integration(function() {
        describe('Inferno Guard Invoker\'s action ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['inferno-guard-invoker', 'serene-warrior'],
                        dynastyDiscard: ['akodo-toturi'],
                        hand: ['forebearer-s-echoes']
                    },
                    player2: {
                        inPlay: ['solemn-scholar', 'fushicho'],
                        provinces: ['shameful-display', 'endless-plains']
                    }
                });

                this.player1.player.optionSettings.orderForcedAbilities = true;

                this.infernoGuardInvoker = this.player1.findCardByName('inferno-guard-invoker');
                this.sereneWarrior = this.player1.findCardByName('serene-warrior');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.echoes = this.player1.findCardByName('forebearer-s-echoes');

                this.solemnScholar = this.player2.findCardByName('solemn-scholar');
                this.fushicho = this.player2.findCardByName('fushicho');
                this.endlessPlains = this.player2.findCardByName('endless-plains', 'province 2');

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

            it('should sacrifice the targeted character at the end of the conflict if the province breaks this conflict', function() {
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
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Action Window');
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

            it('should let first player pick the order when multiple delayed effects fire (Inferno Guard Invoker + Forebearer\'s Echoes)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sereneWarrior],
                    defenders: [this.fushicho]
                });

                this.player2.pass();

                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.akodoToturi);
                this.player2.pass();
                this.player1.clickCard(this.infernoGuardInvoker);
                this.player1.clickCard(this.akodoToturi);
                expect(this.akodoToturi.isHonored).toBe(true);

                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                this.player1.clickPrompt('Pass');

                expect(this.player1).toHavePrompt('Order Simultaneous effects');
                expect(this.player1).toHavePromptButton('Forebearer\'s Echoes\'s effect on Akodo Toturi');
                expect(this.player1).toHavePromptButton('Inferno Guard Invoker\'s effect on Akodo Toturi');

                this.player1.clickPrompt('Inferno Guard Invoker\'s effect on Akodo Toturi');
                expect(this.getChatLogs(5)).toContain('Akodo Toturi is discarded, burned to a pile of ash due to the delayed effect of Inferno Guard Invoker');
                expect(this.akodoToturi.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should discard the target of Inferno Guard Invoker if the province was broken by other means (e.g: Endless Plains)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.sereneWarrior, this.infernoGuardInvoker],
                    province: this.endlessPlains
                });
                this.player2.clickCard(this.endlessPlains);
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.sereneWarrior);


                this.player2.clickPrompt('Pass');
                this.player2.clickCard(this.fushicho);
                this.player2.clickPrompt('Done');

                this.player2.pass();
                this.player1.clickCard(this.infernoGuardInvoker);
                this.player1.clickCard(this.infernoGuardInvoker);

                this.player2.pass();
                this.player1.pass();

                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.getChatLogs(5)).toContain('Inferno Guard Invoker is discarded, burned to a pile of ash due to the delayed effect of Inferno Guard Invoker');

                expect(this.infernoGuardInvoker.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
