describe('Kuni Wastelands', function() {
    integration(function() {
        describe('Kuni Wastelands\'s constant ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-challenger','isawa-ujina','kaiu-envoy','iuchi-shahai','miwaku-kabe-guard'],
                        hand: ['duelist-training']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['assassination'],
                        provinces: ['kuni-wastelands']
                    }
                });
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.ujina = this.player1.findCardByName('isawa-ujina');
                this.envoy = this.player1.findCardByName('kaiu-envoy');
                this.shahai = this.player1.findCardByName('iuchi-shahai');
                this.kabeGuard = this.player1.findCardByName('miwaku-kabe-guard');

                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.assassination = this.player2.findCardByName('assassination');
                this.wastelands = this.player2.findCardByName('kuni-wastelands');
            });

            it('should stop triggered abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.challenger],
                    defenders: [],
                    province: this.wastelands
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.challenger);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should stop sincerity and courtesy', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.envoy],
                    defenders: [],
                    province: this.wastelands
                });
                let cards = this.player1.hand.length;
                let fate = this.player1.fate;

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.envoy);
                expect(this.envoy.location).toBe('dynasty discard pile');
                expect(this.player1.hand.length).toBe(cards);
                expect(this.player1.fate).toBe(fate);
            });

            it('should stop pride', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kabeGuard],
                    defenders: [],
                    province: this.wastelands
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t Resolve');
                expect(this.kabeGuard.isHonored).toBe(false);
            });

            it('should allow covert (if facedown)', function() {
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.wastelands);
                this.player1.clickCard(this.shahai);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).toHavePrompt('Choose covert target for Iuchi Shahai');
            });

            it('should not allow covert (if faceup)', function() {
                this.wastelands.facedown = false;
                this.noMoreActions();
                this.player1.clickRing('air');
                this.player1.clickCard(this.wastelands);
                this.player1.clickCard(this.shahai);
                this.player1.clickPrompt('Initiate Conflict');
                expect(this.player1).not.toHavePrompt('Choose covert target for Iuchi Shahai');
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should not stop forced abilities', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ujina],
                    defenders: [],
                    ring: 'void',
                    province: this.wastelands
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toHavePrompt('Isawa Ujina');
                this.player1.clickCard(this.challenger);
                expect(this.challenger.location).toBe('removed from game');
            });
        });
    });
});
