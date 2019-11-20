describe('Tactical Ingenuity', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-zentaro', 'matsu-berserker', 'honored-general'],
                    hand: ['tactical-ingenuity', 'shosuro-miyako-2', 'seal-of-the-lion'],
                    conflictDeck: ['way-of-the-lion', 'fine-katana', 'strength-in-numbers', 'censure'],
                    conflictDeckSize: 4
                },
                player2: {
                    inPlay: ['gifted-tactician']
                }
            });

            this.zentaro = this.player1.findCardByName('akodo-zentaro');
            this.matsuBerseker = this.player1.findCardByName('matsu-berserker');
            this.honoredGeneral = this.player1.findCardByName('honored-general');
            this.tacticalIngenuity = this.player1.findCardByName('tactical-ingenuity');
            this.sealOfTheLion = this.player1.findCardByName('seal-of-the-lion');
            this.shosuroMiyakoConflict = this.player1.findCardByName('shosuro-miyako-2');
            this.wayOfTheLion = this.player1.findCardByName('way-of-the-lion', 'conflict deck');

            this.giftedTactician = this.player2.findCardByName('gifted-tactician');
        });

        it('should only be allowed to trigger in a conflict', function() {
            this.player1.playAttachment(this.tacticalIngenuity, this.zentaro);
            this.player2.pass();

            this.player1.clickCard(this.zentaro);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should only be allowed to be attached to a commander', function() {
            this.player1.clickCard(this.tacticalIngenuity);
            expect(this.player1).toBeAbleToSelect(this.zentaro);
            expect(this.player1).toBeAbleToSelect(this.giftedTactician);
            expect(this.player1).not.toBeAbleToSelect(this.matsuBerseker);
        });

        it('should allow you to look at the top 4 and draw an event', function() {
            this.player1.playAttachment(this.tacticalIngenuity, this.zentaro);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zentaro],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.zentaro);
            expect(this.player1).toHavePrompt('Select a card to reveal and put in your hand');
            expect(this.player1).toHavePromptButton('Way of the Lion');
            expect(this.player1).toHaveDisabledPromptButton('Fine Katana');
            expect(this.player1).toHavePromptButton('Strength in Numbers');
            expect(this.player1).toHavePromptButton('Censure');

            this.player1.clickPrompt('Way of the Lion');
            expect(this.wayOfTheLion.location).toBe('hand');
        });

        it('should fall off when disguised over by a non-commander', function() {
            this.player1.playAttachment(this.tacticalIngenuity, this.honoredGeneral);
            this.player2.pass();

            this.player1.clickCard(this.shosuroMiyakoConflict);
            this.player1.clickCard(this.honoredGeneral);
            this.player1.clickPrompt('Pass');

            expect(this.tacticalIngenuity.parent).toBe(null);
            expect(this.tacticalIngenuity.location).toBe('conflict discard pile');
        });

        it('should not fall off when disguised over by a non-commander carrying seal of the lion', function() {
            this.player1.playAttachment(this.tacticalIngenuity, this.honoredGeneral);
            this.player2.pass();
            this.player1.playAttachment(this.sealOfTheLion, this.honoredGeneral);
            this.player2.pass();

            this.player1.clickCard(this.shosuroMiyakoConflict);
            this.player1.clickCard(this.honoredGeneral);
            this.player1.clickPrompt('Pass');

            expect(this.sealOfTheLion.parent).toBe(this.shosuroMiyakoConflict);
            expect(this.sealOfTheLion.location).toBe('play area');
            expect(this.tacticalIngenuity.parent).toBe(this.shosuroMiyakoConflict);
            expect(this.tacticalIngenuity.location).toBe('play area');
        });
    });
});
