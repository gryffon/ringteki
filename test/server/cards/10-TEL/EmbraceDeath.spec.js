describe('Embrace Death', function() {
    integration(function() {
        describe('Embrace Death\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'akodo-toturi', 'ikoma-prodigy'],
                        hand: ['embrace-death']
                    },
                    player2: {
                        inPlay: ['hida-yakamo', 'kuni-yori']
                    }
                });

                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.akodoToturi = this.player1.findCardByName('akodo-toturi');
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.embraceDeath = this.player1.findCardByName('embrace-death');

                this.hidaYakamo = this.player2.findCardByName('hida-yakamo');
                this.kuniYori = this.player2.findCardByName('kuni-yori');

                this.noMoreActions();

            });

            it('should let you trigger it when you lose a conflict with a bushi and discard an enemy character without fate', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceDeath);
                this.player1.clickCard(this.embraceDeath);

                expect(this.player1).toBeAbleToSelect(this.hidaYakamo);
                this.player1.clickCard(this.hidaYakamo);

                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);

                expect(this.getChatLogs(10)).toContain('player1 plays Embrace Death, sacrificing Matsu Berserker to discard Hida Yakamo');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.hidaYakamo.location).toBe('dynasty discard pile');
            });

            it('should let you trigger and discard characters that are outside the conflict as well', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceDeath);
                this.player1.clickCard(this.embraceDeath);

                expect(this.player1).toBeAbleToSelect(this.kuniYori);
                this.player1.clickCard(this.kuniYori);

                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);

                expect(this.getChatLogs(10)).toContain('player1 plays Embrace Death, sacrificing Matsu Berserker to discard Kuni Yori');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.kuniYori.location).toBe('dynasty discard pile');
            });

            it('should let you trigger it when you lose a conflict with a bushi and remove a fate from an enemy character', function () {
                this.hidaYakamo.fate = 1;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceDeath);
                this.player1.clickCard(this.embraceDeath);

                expect(this.player1).toBeAbleToSelect(this.hidaYakamo);
                this.player1.clickCard(this.hidaYakamo);

                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);

                expect(this.getChatLogs(10)).toContain('player1 plays Embrace Death, sacrificing Matsu Berserker to remove 1 fate from Hida Yakamo');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.hidaYakamo.location).toBe('play area');
                expect(this.hidaYakamo.fate).toBe(0);
            });

            it('should let you trigger it when you lose a conflict with a bushi and remove a fate from an enemy character outside the conflict', function () {
                this.kuniYori.fate = 1;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.matsuBerserker],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.embraceDeath);
                this.player1.clickCard(this.embraceDeath);

                expect(this.player1).toBeAbleToSelect(this.kuniYori);
                this.player1.clickCard(this.kuniYori);

                expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
                this.player1.clickCard(this.matsuBerserker);

                expect(this.getChatLogs(10)).toContain('player1 plays Embrace Death, sacrificing Matsu Berserker to remove 1 fate from Kuni Yori');
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.kuniYori.location).toBe('play area');
                expect(this.kuniYori.fate).toBe(0);
            });

            it('shouldn\'t let you trigger it when you win a conflict as the attacker', function () {
                this.hidaYakamo.fate = 1;
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoToturi],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('shouldn\'t let you trigger it when you lose a conflict without a bushi', function () {
                this.hidaYakamo.fate = 1;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.hidaYakamo]
                });

                this.player2.pass();
                this.player1.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.clickCard('embrace-death');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});

