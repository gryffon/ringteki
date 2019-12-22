describe('Iron Foundations Stance', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate', 'doji-challenger', 'togashi-mitsu'],
                    hand: ['iron-foundations-stance', 'hurricane-punch', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'togashi-kazue'],
                    hand: ['rout', 'hurricane-punch']
                }
            });

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.hurricane = this.player1.findCardByName('hurricane-punch');
            this.katana = this.player1.findCardByName('fine-katana');
            this.stance = this.player1.findCardByName('iron-foundations-stance');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.rout = this.player2.findCardByName('rout');
            this.kazue = this.player2.findCardByName('togashi-kazue');
            this.hurricane2 = this.player2.findCardByName('hurricane-punch');
        });

        it('should allow selecting a participating monk', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.stance);
            expect(this.player1).toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
        });

        it('should prevent bowing and sending home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);

            expect(this.getChatLogs(3)).toContain('player1 plays Iron Foundations Stance to prevent opponents\' actions from bowing or moving home Togashi Initiate');

            this.player2.clickCard(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.challenger);

            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.rout);
            expect(this.player2).not.toBeAbleToSelect(this.initiate);
            expect(this.player2).toBeAbleToSelect(this.challenger);
        });

        it('should not draw a card if no kiho has been played', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);
            expect(this.player1.hand.length).toBe(hand - 1);
        });

        it('should not draw a card if only opponent has played a kiho', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan, this.kazue],
                type: 'military'
            });

            this.player2.clickCard(this.hurricane2);
            this.player2.clickCard(this.kazue);
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);
            expect(this.player1.hand.length).toBe(hand - 1);
        });

        it('should not draw a card if a non-kiho has been played', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);
            expect(this.player1.hand.length).toBe(hand - 1);
        });

        it('should draw a card if a kiho has been played', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate, this.challenger],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.hurricane);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);
            expect(this.player1.hand.length).toBe(hand);
            expect(this.getChatLogs(3)).toContain('player1 plays Iron Foundations Stance to prevent opponents\' actions from bowing or moving home Togashi Initiate and draw 1 card');
        });

        it('kiho being played should not carry over to the next conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.kuwanan],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.hurricane);
            this.player1.clickCard(this.initiate);
            this.noMoreActions();

            this.initiate.bowed = false;
            this.kuwanan.bowed = false;

            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.initiate],
                type: 'military',
                ring: 'fire'
            });

            let hand = this.player1.hand.length;
            this.player1.clickCard(this.stance);
            this.player1.clickCard(this.initiate);
            expect(this.player1.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(3)).toContain('player1 plays Iron Foundations Stance to prevent opponents\' actions from bowing or moving home Togashi Initiate');
        });
    });
});
