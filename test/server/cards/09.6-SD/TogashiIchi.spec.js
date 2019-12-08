describe('Togashi Ichi', function() {
    integration(function() {
        describe('Togashi Ichi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-ichi', 'doji-whisperer'],
                        hand: ['a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name']
                    },
                    player2: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name', 'a-new-name']
                    }
                });
                this.ichi = this.player1.findCardByName('togashi-ichi');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.manipulator = this.player2.findCardByName('bayushi-manipulator');

                this.P1ANN = [];
                this.P2ANN = [];
                this.player1.filterCardsByName('a-new-name').forEach(card => this.P1ANN.push(card));
                this.player2.filterCardsByName('a-new-name').forEach(card => this.P2ANN.push(card));

                this.p1shameful1 = this.player1.findCardByName('shameful-display', 'province 1');

                this.shameful1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.shameful2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.shameful3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.shameful4 = this.player2.findCardByName('shameful-display', 'province 4');
                this.shamefulSH = this.player2.findCardByName('shameful-display', 'stronghold province');

                this.shameful2.isBroken = true;
                this.shameful3.isBroken = true;
                this.shameful4.isBroken = true;

                this.noMoreActions();
            });

            it('should trigger once ten cards have been played (just me)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ichi, this.whisperer],
                    defenders: [this.manipulator],
                    province: this.shameful1
                });

                this.player2.pass();
                let i = 0;
                for(i = 0; i < this.P1ANN.length; i++) {
                    this.player1.clickCard(this.ichi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.P1ANN[i]);
                    this.player1.clickCard(this.ichi);
                    this.player2.pass();
                }

                expect(this.shameful1.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.shameful1.isBroken).toBe(true);
            });

            it('should trigger once ten cards have been played (opponent)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ichi, this.whisperer],
                    defenders: [this.manipulator],
                    province: this.shameful1
                });

                let i = 0;
                for(i = 0; i < this.P1ANN.length; i++) {
                    this.player2.clickCard(this.P2ANN[i]);
                    this.player2.clickCard(this.ichi);
                    if(i !== this.P1ANN.length - 1) {
                        this.player1.clickCard(this.ichi);
                        expect(this.player1).toHavePrompt('Conflict Action Window');
                        this.player1.pass();
                    }
                }

                expect(this.shameful1.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.shameful1.isBroken).toBe(true);
            });

            it('should trigger once ten cards have been played (mix)', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ichi, this.whisperer],
                    defenders: [this.manipulator],
                    province: this.shameful1
                });

                let i = 0;
                for(i = 0; i < 5; i++) {
                    this.player2.clickCard(this.P2ANN[i]);
                    this.player2.clickCard(this.ichi);

                    this.player1.clickCard(this.ichi);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.P1ANN[i]);
                    this.player1.clickCard(this.ichi);
                }
                this.player2.pass();

                expect(this.shameful1.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.shameful1.isBroken).toBe(true);
            });

            it('should not trigger at the stronghold province', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ichi, this.whisperer],
                    defenders: [this.manipulator],
                    province: this.shamefulSH
                });

                this.player2.pass();
                let i = 0;
                for(i = 0; i < this.P1ANN.length; i++) {
                    this.player1.clickCard(this.P1ANN[i]);
                    this.player1.clickCard(this.ichi);
                    this.player2.pass();
                }

                expect(this.shamefulSH.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.shamefulSH.isBroken).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.whisperer],
                    defenders: [this.manipulator],
                    province: this.shameful1
                });

                this.player2.pass();
                let i = 0;
                for(i = 0; i < this.P1ANN.length; i++) {
                    this.player1.clickCard(this.P1ANN[i]);
                    this.player1.clickCard(this.ichi);
                    this.player2.pass();
                }

                expect(this.shamefulSH.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.shamefulSH.isBroken).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger on defense', function() {
                this.player1.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.manipulator],
                    defenders: [this.ichi],
                    province: this.p1shameful1
                });

                let i = 0;
                for(i = 0; i < this.P1ANN.length; i++) {
                    this.player1.clickCard(this.P1ANN[i]);
                    this.player1.clickCard(this.ichi);
                    this.player2.pass();
                }

                expect(this.p1shameful1.isBroken).toBe(false);
                this.player1.clickCard(this.ichi);
                expect(this.p1shameful1.isBroken).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
