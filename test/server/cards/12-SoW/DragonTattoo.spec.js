describe('Dragon Tattoo', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-kazue', 'doji-challenger'],
                    hand: ['way-of-the-scorpion', 'way-of-the-crane', 'dragon-tattoo', 'dragon-tattoo', 'mantra-of-fire', 'rising-stars-kata'],
                    conflictDiscard: ['defend-your-honor']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['way-of-the-scorpion']
                }
            });

            this.kazue = this.player1.findCardByName('togashi-kazue');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.dragonTattoo1 = this.player1.filterCardsByName('dragon-tattoo')[0];
            this.dragonTattoo2 = this.player1.filterCardsByName('dragon-tattoo')[1];
            this.mantraOfFire = this.player1.findCardByName('mantra-of-fire');
            this.kata = this.player1.findCardByName('rising-stars-kata');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.scorpion2 = this.player2.findCardByName('way-of-the-scorpion');

            this.player1.playAttachment(this.dragonTattoo1, this.kazue);
            this.player2.pass();
            this.player1.playAttachment(this.dragonTattoo2, this.challenger);
        });

        it('should react after you target your own character with an event', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo2);

            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kuwanan);

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(true);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.scorpion.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 plays Way of the Scorpion to dishonor Togashi Kazue');
            expect(this.getChatLogs(5)).toContain('player1 uses Dragon Tattoo to play Way of the Scorpion');
            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Scorpion to dishonor Doji Kuwanan');
            expect(this.getChatLogs(3)).toContain('Way of the Scorpion is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should not allow chaining with multiple tattoos', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.scorpion);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo2);

            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.kazue.isDishonored).toBe(true);
            expect(this.kuwanan.isDishonored).toBe(false);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.scorpion.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 plays Way of the Scorpion to dishonor Togashi Kazue');
            expect(this.getChatLogs(5)).toContain('player1 uses Dragon Tattoo to play Way of the Scorpion');
            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Scorpion to dishonor Doji Challenger');
            expect(this.getChatLogs(3)).toContain('Way of the Scorpion is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should not react after your opponent targets your character with an event', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.clickCard(this.scorpion2);
            expect(this.player2).toBeAbleToSelect(this.kazue);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);

            this.player2.clickCard(this.kazue);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should allow re-using reactions', function() {
            let hand = this.player1.hand.length;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                type: 'military',
                ring: 'fire'
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mantraOfFire);
            this.player1.clickCard(this.mantraOfFire);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            this.player1.clickCard(this.kazue);

            expect(this.kazue.fate).toBe(2);
            expect(this.player1.hand.length).toBe(hand + 1); //+2 from drawing, -1 from playing mantra

            expect(this.mantraOfFire.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('player1 plays Mantra of Fire to add a fate to Togashi Kazue and draw a card');
            expect(this.getChatLogs(4)).toContain('player1 uses Dragon Tattoo to play Mantra of Fire');
            expect(this.getChatLogs(3)).toContain('player1 plays Mantra of Fire to add a fate to Togashi Kazue and draw a card');
            expect(this.getChatLogs(2)).toContain('Mantra of Fire is removed from the game by Dragon Tattoo\'s effect');
        });

        it('should just remove an event from the game if the copy has no legal targets', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.crane);
            expect(this.player1).not.toBeAbleToSelect(this.kazue);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo2);
            expect(this.player1).not.toBeAbleToSelect(this.dragonTattoo1);

            this.player1.clickCard(this.dragonTattoo2);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.challenger.isHonored).toBe(true);
            expect(this.crane.location).toBe('removed from game');

            expect(this.getChatLogs(4)).toContain('player1 plays Way of the Crane to honor Doji Challenger');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove Way of the Crane from the game');
        });

        it('should just remove a "max 1 per conflict" event from the game rather than resolve it again', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kazue, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.kata);
            expect(this.player1).toBeAbleToSelect(this.kazue);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.kazue);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dragonTattoo1);
            this.player1.clickCard(this.dragonTattoo1);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.kata.location).toBe('removed from game');

            expect(this.getChatLogs(4)).toContain('player1 plays Rising Stars Kata to give Togashi Kazue +3 military skill until the end of the conflict');
            expect(this.getChatLogs(3)).toContain('player1 uses Dragon Tattoo to remove Rising Stars Kata from the game');
        });
    });
});