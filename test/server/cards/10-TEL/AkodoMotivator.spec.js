describe('Akodo Motivator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-hotaru', 'paragon-of-grace', 'favored-niece'],
                    hand: ['way-of-the-crane', 'spies-at-court', 'letter-from-the-daimyo', 'oracle-of-stone']
                },
                player2: {
                    inPlay: ['akodo-toturi', 'akodo-motivator'],
                    hand: ['sharpen-the-mind', 'policy-debate']
                }
            });

            this.paragon = this.player1.findCardByName('paragon-of-grace');
            this.hotaru = this.player1.findCardByName('doji-hotaru');
            this.favoredNiece = this.player1.findCardByName('favored-niece');
            this.wayOfTheCrane = this.player1.findCardByName('way-of-the-crane');
            this.spiesAtCourt = this.player1.findCardByName('spies-at-court');
            this.letterFromTheDaimyo = this.player1.findCardByName('letter-from-the-daimyo');
            this.oracleOfStone = this.player1.findCardByName('oracle-of-stone');
            this.motivator = this.player2.findCardByName('akodo-motivator');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.sharpenTheMind = this.player2.findCardByName('sharpen-the-mind');
            this.policyDebate = this.player2.findCardByName('policy-debate');
            this.player1StartingHandSize = this.player1.hand.length;
            this.player2StartingHandSize = this.player2.hand.length;
        });

        it('should take an eye for an eye when made to discard one random card by opponents card effect', function() {
            this.player1.clickCard(this.wayOfTheCrane);
            this.player1.clickCard(this.paragon);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.paragon],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.paragon);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 1);
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize - 2);
        });

        it('should take an eye for an eye when made to discard multiple random cards by opponents card effect', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.paragon],
                defenders: [],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.spiesAtCourt);
            this.player1.clickCard(this.spiesAtCourt);
            expect(this.player1).toBeAbleToSelect(this.paragon);
            this.player1.clickCard(this.paragon);
            expect(this.player2).toHavePrompt('Choose order for random discard');
            this.player2.clickPrompt('Done');
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1).toHavePrompt('Choose order for random discard');
            this.player1.clickPrompt('Done');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize - 3);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 2);
        });

        it('should take an eye for an eye when made to discard by opponent\'s earth ring', function() {
            this.noMoreActions();
            this.initiateConflict({
                ring: 'earth',
                attackers: [this.paragon],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Draw a card and opponent discards');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize + 1);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 1);
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize);
        });

        it('should be able to trigger on an earth ring triggered on defense by Toturi/Hotaru', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'earth',
                attackers: [this.hotaru],
                defenders: [this.toturi]
            });
            this.noMoreActions();
            expect(this.player2).toBeAbleToSelect(this.toturi);
            this.player2.clickCard(this.toturi);
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 1);
        });

        it('should make opponent discard random cards when made to discard chosen cards', function() {
            this.player1.clickCard(this.letterFromTheDaimyo);
            this.player1.clickCard(this.paragon);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                attackers: [this.paragon],
                defenders: [],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toBeAbleToSelect(this.letterFromTheDaimyo);
            this.player1.clickCard(this.letterFromTheDaimyo);
            expect(this.player2).toHavePrompt('Choose 2 cards to discard');
            this.player2.clickCard(this.sharpenTheMind);
            this.player2.clickCard(this.policyDebate);
            this.player2.clickPrompt('Done');
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1).toHavePrompt('Choose order for random discard');
            this.player1.clickPrompt('Done');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize - 3);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 2);
        });

        it('should be able to trigger outside of a conflict', function() {
            this.player1.clickCard(this.oracleOfStone);
            this.player1.clickCard(this.spiesAtCourt);
            this.player1.clickCard(this.letterFromTheDaimyo);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.sharpenTheMind);
            this.player2.clickPrompt('Done');
            expect(this.player2).toBeAbleToSelect(this.motivator);
            this.player2.clickCard(this.motivator);
            expect(this.player1).toHavePrompt('Choose order for random discard');
            this.player1.clickPrompt('Done');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize - 3);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize);
        });

        it('should not be able to trigger when controller discards for a cost', function() {
            this.player1.pass();
            this.player2.clickCard(this.sharpenTheMind);
            this.player2.clickCard(this.toturi);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 1);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hotaru],
                defenders: [this.toturi]
            });
            this.player2.clickCard(this.sharpenTheMind);
            expect(this.player2).toBeAbleToSelect(this.policyDebate);
            this.player2.clickCard(this.policyDebate);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 2);
            expect(this.player2).not.toBeAbleToSelect(this.motivator);
        });

        it('should not be able to trigger when opponent discards for a cost', function() {
            this.player1.clickCard(this.favoredNiece);
            expect(this.player1).toBeAbleToSelect(this.spiesAtCourt);
            this.player1.clickCard(this.spiesAtCourt);
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize);
            expect(this.player2).not.toBeAbleToSelect(this.motivator);
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should not be able to trigger when controller wins their own policy debate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.favoredNiece],
                defenders: [this.toturi]
            });
            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.toturi);
            this.player2.clickCard(this.favoredNiece);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player2.currentButtons).toContain('Spies at Court');
            this.player2.clickPrompt('Spies at Court');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize - 1);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 1);
            expect(this.player2).not.toBeAbleToSelect(this.motivator);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be able to trigger when controller loses their own policy debate', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hotaru],
                defenders: [this.toturi]
            });
            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.toturi);
            this.player2.clickCard(this.hotaru);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1.currentButtons).toContain('Sharpen the Mind');
            this.player1.clickPrompt('Sharpen the Mind');
            expect(this.player1.hand.length).toBe(this.player1StartingHandSize);
            expect(this.player2.hand.length).toBe(this.player2StartingHandSize - 2);
            expect(this.player2).not.toBeAbleToSelect(this.motivator);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
