describe('Unspoken Etiquette', function() {
    integration(function() {
        describe('Unspoken Etiquette\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-toturi', 'ikoma-ujiaki', 'ikoma-prodigy', 'matsu-berserker']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro', 'bayushi-shoju', 'bayushi-liar', 'bayushi-yunako'],
                        hand: ['unspoken-etiquette']
                    }
                });

                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.ikomaUjiaki = this.player1.findCardByName('ikoma-ujiaki');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');

                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.bayushiLiar = this.player2.findCardByName('bayushi-liar');
                this.bayushiYunako = this.player2.findCardByName('bayushi-yunako');
                this.unspokenEttiquette = this.player2.findCardByName('unspoken-etiquette');
            });

            it('should only be playable during political conflicts', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.akodoToturi, this.ikomaUjiaki],
                    defenders: [this.bayushiAramoro, this.bayushiShoju]
                });

                this.player2.clickCard(this.unspokenEttiquette);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should dishonor each participating non-courtier', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoToturi, this.ikomaUjiaki],
                    defenders: [this.bayushiAramoro, this.bayushiShoju]
                });

                this.player2.clickCard(this.unspokenEttiquette);
                expect(this.bayushiAramoro.isDishonored).toBe(true);
                expect(this.akodoToturi.isDishonored).toBe(true);
                expect(this.bayushiShoju.isDishonored).toBe(false);
                expect(this.ikomaUjiaki.isDishonored).toBe(false);
            });

            it('should not dishonor each non-participating non-courtier', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoToturi, this.ikomaUjiaki],
                    defenders: [this.bayushiAramoro, this.bayushiShoju]
                });

                this.player2.clickCard(this.unspokenEttiquette);
                expect(this.matsuBerserker.isDishonored).toBe(false);
                expect(this.bayushiYunako.isDishonored).toBe(false);
            });
        });
    });
});

