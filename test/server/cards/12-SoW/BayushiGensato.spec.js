describe('Bayushi Gensato', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['border-rider'],
                    hand: ['banzai', 'curved-blade', 'born-in-war']
                },
                player2: {
                    inPlay: ['bayushi-gensato'],
                    hand: ['fine-katana', 'banzai', 'unleash-the-djinn']
                }
            });

            this.borderRider = this.player1.findCardByName('border-rider');
            this.banzaip1 = this.player1.findCardByName('banzai');
            this.curvedBlade = this.player1.findCardByName('curved-blade');
            this.bornInWar = this.player1.findCardByName('born-in-war');

            this.gensato = this.player2.findCardByName('bayushi-gensato');
            this.banzaip2 = this.player2.findCardByName('banzai');
            this.katana = this.player2.findCardByName('fine-katana');
            this.djinn = this.player2.findCardByName('unleash-the-djinn');
        });

        it('should bow the loser and dishonor the winner', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Bayushi Gensato: 4 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Border Rider and dishonor Bayushi Gensato');
            expect(this.borderRider.bowed).toBe(true);
            expect(this.borderRider.isDishonored).toBe(false);
            expect(this.gensato.bowed).toBe(false);
            expect(this.gensato.isDishonored).toBe(true);
        });

        it('nothing should happen on a tie', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('2');

            expect(this.getChatLogs(4)).toContain('The duel ends in a draw');
            expect(this.getChatLogs(3)).toContain('The duel has no effect');
            expect(this.borderRider.bowed).toBe(false);
            expect(this.borderRider.isDishonored).toBe(false);
            expect(this.gensato.bowed).toBe(false);
            expect(this.gensato.isDishonored).toBe(false);
        });

        it('should ignore attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.clickCard(this.katana);
            this.player2.clickCard(this.borderRider);
            this.player1.pass();

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Bayushi Gensato: 4 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Border Rider and dishonor Bayushi Gensato');
            expect(this.borderRider.bowed).toBe(true);
            expect(this.borderRider.isDishonored).toBe(false);
            expect(this.gensato.bowed).toBe(false);
            expect(this.gensato.isDishonored).toBe(true);
        });

        it('should not ignore buffs', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.clickCard(this.banzaip2);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('Done');
            this.player1.pass();

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Bayushi Gensato: 4 vs 5: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Bayushi Gensato and dishonor Border Rider');
            expect(this.borderRider.bowed).toBe(false);
            expect(this.borderRider.isDishonored).toBe(true);
            expect(this.gensato.bowed).toBe(true);
            expect(this.gensato.isDishonored).toBe(false);
        });

        it('should not ignore buffs on attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.curvedBlade);
            this.player1.clickCard(this.borderRider);

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Bayushi Gensato: 4 vs 5: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Bayushi Gensato and dishonor Border Rider');
            expect(this.borderRider.bowed).toBe(false);
            expect(this.borderRider.isDishonored).toBe(true);
            expect(this.gensato.bowed).toBe(true);
            expect(this.gensato.isDishonored).toBe(false);
        });

        it('should ignore effects on attachments that modify the skill modifier', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.bornInWar);
            this.player1.clickCard(this.borderRider);

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(4)).toContain('Bayushi Gensato: 4 vs 3: Border Rider');
            expect(this.getChatLogs(3)).toContain('Duel Effect: bow Border Rider and dishonor Bayushi Gensato');
            expect(this.borderRider.bowed).toBe(true);
            expect(this.borderRider.isDishonored).toBe(false);
            expect(this.gensato.bowed).toBe(false);
            expect(this.gensato.isDishonored).toBe(true);
        });

        it('should not ignore set effects', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.gensato],
                type: 'military'
            });

            this.player2.clickCard(this.djinn);
            this.player1.pass();

            this.player2.clickCard(this.gensato);
            this.player2.clickCard(this.borderRider);
            this.player2.clickPrompt('1');
            this.player1.clickPrompt('1');

            expect(this.getChatLogs(5)).toContain('Bayushi Gensato: 4 vs 4: Border Rider');
            expect(this.getChatLogs(4)).toContain('The duel ends in a draw');
            expect(this.getChatLogs(3)).toContain('The duel has no effect');
            expect(this.borderRider.bowed).toBe(false);
            expect(this.borderRider.isDishonored).toBe(false);
            expect(this.gensato.bowed).toBe(false);
            expect(this.gensato.isDishonored).toBe(false);
        });
    });
});
