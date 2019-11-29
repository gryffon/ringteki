describe('Yogo Asami', function() {
    integration(function() {
        describe('Yogo Asami\'s triggered ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-asami', 'brash-samurai']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja']
                    }
                });
                this.brash = this.player1.findCardByName('brash-samurai');
                this.yogoAsami = this.player1.findCardByName('yogo-asami');
                this.doomed = this.player2.findCardByName('doomed-shugenja');
                this.noMoreActions();
            });

            it('should work while participating in a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogoAsami, this.brash],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                expect(this.yogoAsami.bowed).toBe(false);
                this.player1.clickCard(this.yogoAsami);

                let mil = this.doomed.getMilitarySkill();
                expect(this.player1).toBeAbleToSelect(this.yogoAsami);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.doomed);
                this.player1.clickCard(this.doomed);
                expect(this.doomed.getMilitarySkill()).toBe(mil - 2);
                expect(this.yogoAsami.bowed).toBe(true);
            });

            it('should work while participating in a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.yogoAsami, this.brash],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                expect(this.yogoAsami.bowed).toBe(false);
                this.player1.clickCard(this.yogoAsami);

                let mil = this.doomed.getMilitarySkill();
                expect(this.player1).toBeAbleToSelect(this.yogoAsami);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.doomed);
                this.player1.clickCard(this.doomed);
                expect(this.doomed.getMilitarySkill()).toBe(mil - 2);
                expect(this.yogoAsami.bowed).toBe(true);
            });

            it('should not work while not participating in a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                expect(this.yogoAsami.bowed).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yogoAsami);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be able to target non-participating characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogoAsami],
                    defenders: [this.doomed]
                });
                this.player2.pass();
                expect(this.yogoAsami.bowed).toBe(false);
                this.player1.clickCard(this.yogoAsami);

                expect(this.player1).toBeAbleToSelect(this.yogoAsami);
                expect(this.player1).not.toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.doomed);
            });

            it('should not work while bowed', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogoAsami, this.brash],
                    defenders: [this.doomed]
                });
                this.yogoAsami.bowed = true;
                this.player2.pass();
                expect(this.yogoAsami.bowed).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.yogoAsami);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Yogo Asami\'s constant ability (one Asami)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-asami', 'bayushi-kachiko', 'mirumoto-raitsugu'],
                        hand: ['a-fate-worse-than-death', 'kirei-ko']
                    },
                    player2: {
                        inPlay: ['bayushi-kachiko', 'mirumoto-raitsugu'],
                        hand: ['a-fate-worse-than-death', 'kirei-ko']
                    }
                });
                this.yogoAsami = this.player1.findCardByName('yogo-asami');

                this.p1afwtd = this.player1.findCardByName('a-fate-worse-than-death');
                this.p1kireiko = this.player1.findCardByName('kirei-ko');
                this.p1Kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.p1raitsugu = this.player1.findCardByName('mirumoto-raitsugu');

                this.p2afwtd = this.player2.findCardByName('a-fate-worse-than-death');
                this.p2kireiko = this.player2.findCardByName('kirei-ko');
                this.p2Kachiko = this.player2.findCardByName('bayushi-kachiko');
                this.p2raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.p1Kachiko, this.p1raitsugu],
                    defenders: [this.p2Kachiko, this.p2raitsugu]
                });
            });

            it('should prevent targeting by opponent abilities (event)', function() {
                this.player2.clickCard(this.p2afwtd);
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.p1Kachiko);
                expect(this.player2).not.toBeAbleToSelect(this.p2Kachiko);
            });

            it('should prevent targeting by opponent abilities (printed)', function() {
                this.player2.clickCard(this.p2raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.p1Kachiko);
            });

            it('should allow targeting by own abilities (event)', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1afwtd);
                expect(this.player1).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p1Kachiko);
                expect(this.player1).toBeAbleToSelect(this.p2Kachiko);
            });

            it('should allow targeting by own abilities (printed)', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p2Kachiko);
            });

            it('should allow non-targeting abilities', function() {
                this.player2.pass();
                expect(this.p1Kachiko.bowed).toBe(false);
                this.player1.clickCard(this.p1Kachiko);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                this.player1.clickCard(this.p2raitsugu);
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2kireiko);
                this.player2.clickCard(this.p2kireiko);
                expect(this.p1Kachiko.bowed).toBe(true);
            });
        });

        describe('Yogo Asami\'s constant ability (two Asamis)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-asami', 'bayushi-kachiko', 'mirumoto-raitsugu'],
                        hand: ['a-fate-worse-than-death', 'kirei-ko']
                    },
                    player2: {
                        inPlay: ['yogo-asami', 'bayushi-kachiko', 'mirumoto-raitsugu', 'isawa-ujina'],
                        hand: ['a-fate-worse-than-death', 'kirei-ko']
                    }
                });
                this.p1yogoAsami = this.player1.findCardByName('yogo-asami');
                this.p2yogoAsami = this.player2.findCardByName('yogo-asami');

                this.p1afwtd = this.player1.findCardByName('a-fate-worse-than-death');
                this.p1kireiko = this.player1.findCardByName('kirei-ko');
                this.p1Kachiko = this.player1.findCardByName('bayushi-kachiko');
                this.p1raitsugu = this.player1.findCardByName('mirumoto-raitsugu');

                this.p2afwtd = this.player2.findCardByName('a-fate-worse-than-death');
                this.p2kireiko = this.player2.findCardByName('kirei-ko');
                this.p2Kachiko = this.player2.findCardByName('bayushi-kachiko');
                this.p2raitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.ujina = this.player2.findCardByName('isawa-ujina');

                this.noMoreActions();

                this.initiateConflict({
                    type: 'political',
                    attackers: [this.p1Kachiko, this.p1raitsugu],
                    defenders: [this.p2Kachiko, this.p2raitsugu],
                    ring: 'void'
                });
            });

            it('should prevent targeting by opponent abilities (event)', function() {
                this.player2.clickCard(this.p2afwtd);
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.p1Kachiko);
                expect(this.player2).not.toBeAbleToSelect(this.p2Kachiko);
            });

            it('should prevent targeting by opponent abilities (printed)', function() {
                this.player2.clickCard(this.p2raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player2).not.toBeAbleToSelect(this.p1Kachiko);
            });

            it('should prevent targeting by own abilities (event)', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1afwtd);
                expect(this.player1).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.p1Kachiko);
                expect(this.player1).not.toBeAbleToSelect(this.p2Kachiko);
            });

            it('should prevent targeting by own abilities (printed)', function() {
                this.player2.pass();
                this.player1.clickCard(this.p1raitsugu);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.p2Kachiko);
            });

            it('should allow non-targeting abilities (opponent)', function() {
                this.player2.pass();
                expect(this.p1Kachiko.bowed).toBe(false);
                this.player1.clickCard(this.p1Kachiko);
                expect(this.player1).toBeAbleToSelect(this.p2raitsugu);
                this.player1.clickCard(this.p2raitsugu);
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2kireiko);
                this.player2.clickCard(this.p2kireiko);
                expect(this.p1Kachiko.bowed).toBe(true);
            });

            it('should allow non-targeting abilities (own)', function() {
                expect(this.p2Kachiko.bowed).toBe(false);
                this.player2.clickCard(this.p2Kachiko);
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                this.player2.clickCard(this.p1raitsugu);
                this.player2.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.p1kireiko);
                this.player1.clickCard(this.p1kireiko);
                expect(this.p2Kachiko.bowed).toBe(true);
            });

            it('should allow targeting by forced reactinos (Ujina)', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Isawa Ujina');
                expect(this.player2).toBeAbleToSelect(this.p1raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p2raitsugu);
                expect(this.player2).toBeAbleToSelect(this.p1Kachiko);
                expect(this.player2).toBeAbleToSelect(this.p2Kachiko);
            });
        });
    });
});
