describe('Slovenly Scavenger', function() {
    integration(function() {
        describe('Slovenly Scavenger\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['slovenly-scavenger', 'callow-delegate'],
                        dynastyDiscard: ['imperial-storehouse', 'hida-kisada'],
                        conflictDiscard: ['let-go', 'assassination']
                    },
                    player2: {
                        inPlay: ['slovenly-scavenger'],
                        dynastyDiscard: ['imperial-storehouse', 'hida-kisada'],
                        conflictDiscard: ['let-go', 'assassination'],
                        hand: ['a-new-name']
                    }
                });
                this.callow = this.player1.findCardByName('callow-delegate');
                this.scavengerP1 = this.player1.findCardByName('slovenly-scavenger');
                this.storehouseP1 = this.player1.findCardByName('imperial-storehouse');
                this.kisadaP1 = this.player1.findCardByName('hida-kisada');
                this.letGoP1 = this.player1.findCardByName('let-go');
                this.assassinationP1 = this.player1.findCardByName('assassination');

                this.scavengerP2 = this.player2.findCardByName('slovenly-scavenger');
                this.storehouseP2 = this.player2.findCardByName('imperial-storehouse');
                this.kisadaP2 = this.player2.findCardByName('hida-kisada');
                this.letGoP2 = this.player2.findCardByName('let-go');
                this.assassinationP2 = this.player2.findCardByName('assassination');
                this.newName = this.player2.findCardByName('a-new-name');

                this.player1.pass();
                this.player2.playAttachment(this.newName, this.scavengerP2);
                this.noMoreActions();
            });

            it('should prompt to shuffle a discard pile into the appropriate deck', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                expect(this.player1).toHavePromptButton('My Dynasty');
                expect(this.player1).toHavePromptButton('My Conflict');
                expect(this.player1).toHavePromptButton('Opponent\'s Dynasty');
                expect(this.player1).toHavePromptButton('Opponent\'s Conflict');
            });

            it('should shuffle my dynasty discard pile into my dynasty deck', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                let size = this.player1.dynastyDeck.length;
                this.player1.clickPrompt('My Dynasty');
                expect(this.storehouseP1.location).toBe('dynasty deck');
                expect(this.kisadaP1.location).toBe('dynasty deck');
                expect(this.player1.player.dynastyDiscardPile.size()).toBe(0);
                expect(this.player1.dynastyDeck.length).toBe(size + 2);
                expect(this.getChatLogs(3)).toContain('player1 uses Slovenly Scavenger, sacrificing Slovenly Scavenger to shuffle player1\'s dynasty discard pile into their deck');
                expect(this.getChatLogs(2)).toContain('player1 is shuffling their dynasty deck');
            });

            it('should shuffle my conflict discard pile into my conflict deck', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                let size = this.player1.conflictDeck.length;
                this.player1.clickPrompt('My Conflict');
                expect(this.storehouseP1.location).toBe('dynasty discard pile');
                expect(this.letGoP1.location).toBe('conflict deck');
                expect(this.assassinationP1.location).toBe('conflict deck');
                expect(this.scavengerP1.location).toBe('conflict deck');
                expect(this.player1.player.conflictDiscardPile.size()).toBe(0);
                expect(this.player1.conflictDeck.length).toBe(size + 3);

                expect(this.getChatLogs(3)).toContain('player1 uses Slovenly Scavenger, sacrificing Slovenly Scavenger to shuffle player1\'s conflict discard pile into their deck');
                expect(this.getChatLogs(2)).toContain('player1 is shuffling their conflict deck');
            });

            it('should shuffle opponent dynasty discard pile into their dynasty deck', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                let size = this.player2.dynastyDeck.length;
                this.player1.clickPrompt('Opponent\'s Dynasty');
                expect(this.storehouseP2.location).toBe('dynasty deck');
                expect(this.kisadaP2.location).toBe('dynasty deck');
                expect(this.player2.player.dynastyDiscardPile.size()).toBe(0);
                expect(this.player2.dynastyDeck.length).toBe(size + 2);

                expect(this.getChatLogs(3)).toContain('player1 uses Slovenly Scavenger, sacrificing Slovenly Scavenger to shuffle player2\'s dynasty discard pile into their deck');
                expect(this.getChatLogs(2)).toContain('player2 is shuffling their dynasty deck');
            });

            it('should shuffle opponent conflict discard pile into their conflict deck', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                let size = this.player2.conflictDeck.length;

                this.player1.clickPrompt('Opponent\'s Conflict');
                expect(this.storehouseP2.location).toBe('dynasty discard pile');
                expect(this.letGoP2.location).toBe('conflict deck');
                expect(this.assassinationP2.location).toBe('conflict deck');
                expect(this.player2.player.conflictDiscardPile.size()).toBe(0);
                expect(this.player2.conflictDeck.length).toBe(size + 2);

                expect(this.getChatLogs(3)).toContain('player1 uses Slovenly Scavenger, sacrificing Slovenly Scavenger to shuffle player2\'s conflict discard pile into their deck');
                expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
            });

            it('should not work if you lose / should work on defense', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: [this.scavengerP2]
                });
                this.player2.pass();
                this.player1.pass();
                expect(this.player2).toHavePrompt('Triggered abilities');
                expect(this.player2).toBeAbleToSelect(this.scavengerP2);
                this.player2.clickCard(this.scavengerP2);
                let size = this.player2.conflictDeck.length;

                this.player2.clickPrompt('My Conflict');
                expect(this.letGoP2.location).toBe('conflict deck');
                expect(this.assassinationP2.location).toBe('conflict deck');
                expect(this.scavengerP2.location).toBe('conflict deck');
                expect(this.newName.location).toBe('conflict deck');
                expect(this.player2.player.conflictDiscardPile.size()).toBe(0);
                expect(this.player2.conflictDeck.length).toBe(size + 4);
            });

            it('should not prompt you to shuffle an empty discard pile', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scavengerP1],
                    defenders: []
                });
                this.player1.moveCard(this.storehouseP1, 'dynasty deck');
                this.player1.moveCard(this.kisadaP1, 'dynasty deck');
                this.player2.moveCard(this.letGoP2, 'conflict deck');
                this.player2.moveCard(this.assassinationP2, 'conflict deck');

                this.player2.pass();
                this.player1.pass();
                expect(this.player1).toBeAbleToSelect(this.scavengerP1);
                this.player1.clickCard(this.scavengerP1);
                expect(this.player1).not.toHavePromptButton('My Dynasty');
                expect(this.player1).toHavePromptButton('My Conflict');
                expect(this.player1).toHavePromptButton('Opponent\'s Dynasty');
                expect(this.player1).not.toHavePromptButton('Opponent\'s Conflict');
            });
        });
    });
});
