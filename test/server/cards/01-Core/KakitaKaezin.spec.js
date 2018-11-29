describe('Kakita Kaezin', function() {
    integration(function() {
        describe('when the target leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['kakita-kaezin','doji-whisperer']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['obstinate-recruit','akodo-gunso']
                    }
                });
                this.kakitaKaezin = this.player1.findCardByName('kakita-kaezin');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.obstinateRecruit = this.player2.findCardByName('obstinate-recruit');
                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.dojiWhisperer],
                    defenders: [this.obstinateRecruit, this.akodoGunso]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                this.player2.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
            });

            it('the duel should still successfully resolve', function() {
                expect(this.kakitaKaezin.inConflict).toBe(true);
                expect(this.dojiWhisperer.inConflict).toBe(false);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
                expect(this.akodoGunso.inConflict).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('when Kakita Kaezin leaves play during the duel', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['kakita-kaezin', 'doji-whisperer'],
                        hand: ['writ-of-authority']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['bayushi-shoju', 'bayushi-liar']
                    }
                });
                this.kakitaKaezin = this.player1.findCardByName('kakita-kaezin');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.writOfAuthority = this.player1.findCardByName('writ-of-authority');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');

                this.player1.clickCard(this.writOfAuthority);
                this.player1.clickCard(this.kakitaKaezin);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.dojiWhisperer],
                    defenders: [this.bayushiShoju, this.bayushiLiar],
                    type: 'political'
                });
                this.player2.clickCard(this.bayushiShoju);
                this.player2.clickCard(this.kakitaKaezin);
                this.player1.pass();
                this.player2.clickCard(this.bayushiShoju);
                this.player2.clickCard(this.kakitaKaezin);
                this.player1.clickCard(this.kakitaKaezin);
                this.player2.clickCard(this.bayushiShoju);
                this.spy = spyOn(this.game, 'addMessage');
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
            });

            it('the duel should still successfully resolve (wthout effect)', function() {
                expect(this.player1.player.honor).toBe(10);
                expect(this.player2.player.honor).toBe(12);
                expect(this.kakitaKaezin.location).toBe('dynasty discard pile');
                expect(this.dojiWhisperer.inConflict).toBe(true);
                expect(this.bayushiShoju.inConflict).toBe(true);
                expect(this.bayushiLiar.inConflict).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Kakita Kaezin\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-kaezin', 'doji-whisperer']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'akodo-gunso']
                    }
                });
                this.kakitaKaezin = this.player1.findCardByName('kakita-kaezin');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
            });

            it('should not trigger if he is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.matsuBerserker, this.akodoGunso]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if there is no defender', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.dojiWhisperer],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger if he is participating as well as an opponent\'s character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin],
                    defenders: [this.matsuBerserker]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.player2).toHavePrompt('Kakita Kaezin');
            });

            it('should allow the opponent to choose a target of the duel', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin],
                    defenders: [this.matsuBerserker, this.akodoGunso]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                expect(this.player2).toHavePrompt('Kakita Kaezin');
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).toBeAbleToSelect(this.akodoGunso);
            });

            it('should send all other characters home if Kakita Kaezin wins', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.dojiWhisperer],
                    defenders: [this.matsuBerserker, this.akodoGunso]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                this.player2.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.kakitaKaezin.inConflict).toBe(true);
                expect(this.dojiWhisperer.inConflict).toBe(false);
                expect(this.matsuBerserker.inConflict).toBe(true);
                expect(this.akodoGunso.inConflict).toBe(false);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should send Kakita Kaezin home if Kakita Kaezin loses', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kakitaKaezin, this.dojiWhisperer],
                    defenders: [this.matsuBerserker, this.akodoGunso]
                });
                this.player2.pass();
                this.player1.clickCard(this.kakitaKaezin);
                this.player2.clickCard(this.matsuBerserker);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.kakitaKaezin.inConflict).toBe(false);
                expect(this.dojiWhisperer.inConflict).toBe(true);
                expect(this.matsuBerserker.inConflict).toBe(true);
                expect(this.akodoGunso.inConflict).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
