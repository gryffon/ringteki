describe('Niten', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['niten-master', 'doji-challenger'],
                    hand: ['niten', 'force-of-the-river', 'mark-of-shame', 'fine-katana', 'greater-understanding']
                },
                player2: {
                    inPlay: ['togashi-yokuni']
                }
            });

            this.master = this.player1.findCardByName('niten-master');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.niten = this.player1.findCardByName('niten');
            this.river = this.player1.findCardByName('force-of-the-river');
            this.shame = this.player1.findCardByName('mark-of-shame');
            this.katana = this.player1.findCardByName('fine-katana');
            this.greater = this.player1.findCardByName('greater-understanding');

            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('should attach to dragon characters', function() {
            this.player1.clickCard(this.niten);
            expect(this.player1).toBeAbleToSelect(this.master);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.yokuni);
        });

        it('should not trigger outside of a conflict', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);
            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not trigger if parent is not participating', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.yokuni],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow selecting a legal attachment', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.master],
                defenders: [this.yokuni],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.player1).toHavePrompt('Niten');
            expect(this.player1).not.toBeAbleToSelect(this.river);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.shame);
            expect(this.player1).not.toBeAbleToSelect(this.greater);
        });

        it('should put attachment into play', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.master],
                defenders: [this.yokuni],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.player1).toHavePrompt('Niten');
            this.player1.clickCard(this.katana);
            expect(this.niten.location).toBe('hand');
            expect(this.katana.location).toBe('play area');
            expect(this.getChatLogs(3)).toContain('player1 uses Niten, returning Niten to their hand to attach Fine Katana to Niten Master');
        });

        it('should trigger reactions to attachments being put into play', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.master],
                defenders: [this.yokuni],
                type: 'military'
            });

            this.master.bowed = true;
            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.master.bowed).toBe(true);
            expect(this.player1).toHavePrompt('Niten');
            this.player1.clickCard(this.katana);
            expect(this.niten.location).toBe('hand');
            expect(this.katana.location).toBe('play area');
            expect(this.getChatLogs(1)).toContain('player1 uses Niten, returning Niten to their hand to attach Fine Katana to Niten Master');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.master);
            this.player1.clickCard(this.master);
            expect(this.master.bowed).toBe(false);
            expect(this.getChatLogs(3)).toContain('player1 uses Niten Master to ready Niten Master');
        });

        it('should not trigger reactions to attachments being played', function() {
            this.player1.clickCard(this.niten);
            this.player1.clickCard(this.master);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.master],
                defenders: [this.yokuni],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.niten);
            expect(this.player1).toHavePrompt('Niten');
            this.player1.clickCard(this.shame);
            expect(this.niten.location).toBe('hand');
            expect(this.shame.location).toBe('play area');
            expect(this.getChatLogs(3)).toContain('player1 uses Niten, returning Niten to their hand to attach Mark of Shame to Niten Master');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
