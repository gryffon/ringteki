describe('Tactical Ingenuity', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-zentaro', 'matsu-berserker'],
                    hand: ['tactical-ingenuity'],
                    conflictDeck: ['way-of-the-lion', 'fine-katana', 'strength-in-numbers', 'censure'],
                    conflictDeckSize: 4
                },
                player2: {
                    inPlay: ['gifted-tactician']
                }
            });

            this.zentaro = this.player1.findCardByName('akodo-zentaro');
            this.matsuBerseker = this.player1.findCardByName('matsu-berserker');
            this.tacticalIngenuity = this.player1.findCardByName('tactical-ingenuity');
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
    });
});
