describe('Shinjo Ambusher', function() {
    integration(function() {
        describe('Shinjo Ambusher ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth'],
                        hand: ['shinjo-ambusher']
                    },
                    player2: {
                        provinces: ['upholding-authority']
                    }
                });

                this.ambusher = this.player1.findCardByName('shinjo-ambusher');
                this.youth = this.player1.findCardByName('moto-youth');
                this.uA = this.player2.findCardByName('upholding-authority', 'province 1');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.youth],
                    defenders: [],
                    province: this.uA
                });
                this.player2.pass(); //sneakily smirking because uA will break
                this.player1.clickCard(this.ambusher);
                this.player1.clickPrompt('0');
            });

            it('should trigger after entering play during a conflict', function() {
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ambusher);
            });

            it('should work if played in a conflict', function() {
                this.player1.clickPrompt('Conflict');
                this.player1.clickCard(this.ambusher);
                expect(this.game.currentConflict.attackerSkill).toBe(5);
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.uA);
                expect(this.uA.isBroken).toBe(true); //frowning angrily
            });

            it('should not trigger if played home', function() {
                this.player1.clickPrompt('Home');
                expect(this.ambusher.inConflict).toBe(false);
                expect(this.game.currentConflict.attackerSkill).toBe(3);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });

        describe('Shinjo Ambusher with Akodo Toshiro interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toshiro'],
                        hand: ['shinjo-ambusher']
                    },
                    player2: {
                        provinces: ['upholding-authority']
                    }
                });

                this.shinjoAmbusher = this.player1.findCardByName('shinjo-ambusher');
                this.akodoToshiro = this.player1.findCardByName('akodo-toshiro');
                this.upholdingAuthority = this.player2.findCardByName('upholding-authority', 'province 1');
            });

            it('should not break the province if Toshiro triggers his ability', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: [],
                    province: this.upholdingAuthority
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoAmbusher);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoAmbusher);
                this.player1.clickCard(this.shinjoAmbusher);
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Break Upholding Authority');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should allow Shinjo Ambusher to trigger its reaction after Toshiro triggers his', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToshiro],
                    defenders: [],
                    province: this.upholdingAuthority
                });
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
                this.player2.pass();
                this.player1.clickCard(this.shinjoAmbusher);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shinjoAmbusher);
                this.player1.clickCard(this.shinjoAmbusher);
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Break Upholding Authority');
                expect(this.player1).toHavePrompt('Air Ring');
            });
        });
    });
});
