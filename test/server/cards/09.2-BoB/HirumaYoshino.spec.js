describe('Hiruma Yoshino', function() {
    integration(function() {
        describe('Hiruma Yoshino\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hiruma-yoshino', 'borderlands-defender', 'humble-magistrate'],
                        dynastyDiscard: ['hida-kisada', 'eager-scout', 'crisis-breaker'],
                        provinces: ['shameful-display', 'shameful-display', 'kuroi-mori']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        hand: ['charge'],
                        dynastyDiscard: ['akodo-toturi', 'favorable-ground', 'venerable-historian', 'akodo-makoto'],
                        provinces: ['shameful-display', 'shameful-display', 'shameful-display', 'sanpuku-seido']
                    }
                });

                this.hirumaYoshino = this.player1.findCardByName('hiruma-yoshino');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.humbleMagistrate = this.player1.findCardByName('humble-magistrate');
                this.hidaKisada = this.player1.findCardByName('hida-kisada', 'dynasty discard pile');
                this.eagerScout = this.player1.findCardByName('eager-scout', 'dynasty discard pile');
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker', 'dynasty discard pile');
                this.player1.placeCardInProvince(this.hidaKisada, 'province 1');
                this.player1.placeCardInProvince(this.eagerScout, 'province 2');
                this.player1.placeCardInProvince(this.crisisBreaker, 'province 3');
                this.P1shamefulDisplay2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.P1kuroiMori3 = this.player1.findCardByName('kuroi-mori', 'province 3');

                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.charge = this.player2.findCardByName('charge');
                this.akodoToturi = this.player2.findCardByName('akodo-toturi', 'dynasty discard pile');
                this.favorableGround = this.player2.findCardByName('favorable-ground', 'dynasty discard pile');
                this.venerableHistorian = this.player2.findCardByName('venerable-historian', 'dynasty discard pile');
                this.akodoMakoto = this.player2.findCardByName('akodo-makoto', 'dynasty discard pile');
                this.P2shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.P2shamefulDisplay3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.P2sanpukuSeido4 = this.player2.findCardByName('sanpuku-seido', 'province 4');
                this.player2.placeCardInProvince(this.akodoToturi, 'province 1');
                this.player2.placeCardInProvince(this.favorableGround, 'province 2');
                this.player2.placeCardInProvince(this.venerableHistorian, 'province 3');
                this.player2.placeCardInProvince(this.akodoMakoto, 'province 4');
            });

            it('should not trigger outside of a military conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: [],
                    type: 'political'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if Hiruma Yoshino is not participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if there is no character in the attacked province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: [],
                    province: this.P2shamefulDisplay2
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if the card in the attacked province is facedown', function() {
                this.hidaKisada.facedown = true;
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.hirumaYoshino]
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to target a character card in the attacked province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).not.toBeAbleToSelect(this.favorableGround);
                expect(this.player1).not.toBeAbleToSelect(this.venerableHistorian);
                expect(this.player1).not.toBeAbleToSelect(this.akodoMakoto);
                expect(this.player1).not.toBeAbleToSelect(this.hidaKisada);
                expect(this.player1).not.toBeAbleToSelect(this.eagerScout);
                expect(this.player1).not.toBeAbleToSelect(this.crisisBreaker);
            });

            it('should add the printed military skill of the target character to your side for the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hirumaYoshino);
                this.player1.clickCard(this.akodoToturi);
                expect(this.game.currentConflict.attackerSkill).toBe(9);
                expect(this.getChatLogs(3)).toContain('player1 uses Hiruma Yoshino to contribute Akodo Toturi\'s printed military skill of 6 to their side of the conflict');
            });

            it('should work when defending', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.hirumaYoshino]
                });
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.akodoToturi);
                expect(this.player1).toBeAbleToSelect(this.hidaKisada);
                this.player1.clickCard(this.hidaKisada);
                expect(this.game.currentConflict.defenderSkill).toBe(10);
                expect(this.getChatLogs(3)).toContain('player1 uses Hiruma Yoshino to contribute Hida Kisada\'s printed military skill of 7 to their side of the conflict');
            });

            it('should not trigger if the character in the attacked province has zero military skill', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.hirumaYoshino],
                    province: this.P1shamefulDisplay2
                });
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger if the character in the attacked province has dash military skill', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: [],
                    province: this.P2shamefulDisplay3
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hirumaYoshino);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should no longer contribute skill if the targeted character is moved from the province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hirumaYoshino);
                this.player1.clickCard(this.akodoToturi);
                expect(this.game.currentConflict.attackerSkill).toBe(9);
                this.player2.clickCard(this.charge);
                this.player2.clickCard(this.akodoToturi);
                expect(this.akodoToturi.location).toBe('play area');
                expect(this.game.currentConflict.attackerSkill).toBe(3);
            });

            it('should not contribute if there is a constant effect that prevents contribution (magistrates)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino, this.humbleMagistrate],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hirumaYoshino);
                this.player1.clickCard(this.akodoToturi);
                expect(this.game.currentConflict.attackerSkill).toBe(2);
            });

            it('should contibute the target\'s glory if the conflict is at Sanpuku Seido', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.hirumaYoshino],
                    defenders: [],
                    province: this.P2sanpukuSeido4
                });
                this.player2.pass();
                expect(this.game.currentConflict.attackerSkill).toBe(2);
                this.player1.clickCard(this.hirumaYoshino);
                this.player1.clickCard(this.akodoMakoto);
                expect(this.game.currentConflict.attackerSkill).toBe(3);
            });

            it('should contibute the target\'s military skill even if the conflict is changed to political', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: [this.hirumaYoshino],
                    province: this.P1kuroiMori3
                });
                expect(this.game.currentConflict.defenderSkill).toBe(3);
                this.player1.clickCard(this.hirumaYoshino);
                this.player1.clickCard(this.crisisBreaker);
                expect(this.game.currentConflict.defenderSkill).toBe(6);
                this.player2.pass();
                this.player1.clickCard(this.P1kuroiMori3);
                this.player1.clickPrompt('Switch the conflict type');
                expect(this.game.currentConflict.defenderSkill).toBe(6);
            });
        });
    });
});

