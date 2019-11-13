describe('Erudite Prestige', function() {
    integration(function() {
        describe('Erudite Prestige Ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-kuwanan'],
                        hand: ['a-new-name', 'erudite-prestige', 'backhanded-compliment']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['backhanded-compliment']
                    }
                });

                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.newName = this.player1.findCardByName('a-new-name');
                this.prestige = this.player1.findCardByName('erudite-prestige');
                this.p1BHC = this.player1.findCardByName('backhanded-compliment');
                this.p2BHC = this.player2.findCardByName('backhanded-compliment');
            });

            it('should be attachable only to courtiers', function() {
                this.player1.clickCard(this.prestige);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            });

            it('should give +1 political', function() {
                this.player1.clickCard(this.prestige);
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                let pol = this.whisperer.getPoliticalSkill();

                this.player2.pass();
                this.player1.clickCard(this.p1BHC);
                this.player1.clickPrompt('player2');
                expect(this.player1).toBeAbleToSelect(this.prestige);
                this.player1.clickCard(this.prestige);
                expect(this.whisperer.getPoliticalSkill()).toBe(pol + 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(3)).toContain('player1 uses Erudite Prestige to give +1political to Doji Whisperer');
            });

            it('should not trigger off opponent cards', function() {
                this.player1.clickCard(this.prestige);
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                let pol = this.whisperer.getPoliticalSkill();

                this.player2.clickCard(this.p2BHC);
                this.player2.clickPrompt('player2');
                expect(this.player1).not.toBeAbleToSelect(this.prestige);
                this.player1.clickCard(this.prestige);
                expect(this.whisperer.getPoliticalSkill()).toBe(pol);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be usable if holder is not participating', function() {
                this.player1.clickCard(this.prestige);
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: []
                });

                let pol = this.whisperer.getPoliticalSkill();

                this.player2.pass();
                this.player1.clickCard(this.p1BHC);
                this.player1.clickPrompt('player2');
                expect(this.player1).not.toBeAbleToSelect(this.prestige);
                this.player1.clickCard(this.prestige);
                expect(this.whisperer.getPoliticalSkill()).toBe(pol);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should trigger off itself', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.prestige);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
                this.player1.clickCard(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.prestige);
            });

            it('should be attachable if the target gains courtiers', function() {
                this.player1.clickCard(this.newName);
                this.player1.clickCard(this.kuwanan);
                this.player2.pass();
                this.player1.clickCard(this.prestige);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
            });
        });
    });
});
