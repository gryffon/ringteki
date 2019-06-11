describe('Chukan Nobue', function() {
    integration(function() {
        describe('Chukan Nobue\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['chukan-nobue'],
                        hand: ['fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['paragon-of-grace'],
                        hand: ['policy-debate'],
                        provinces: ['upholding-authority']
                    }
                });

                this.nobue = this.player1.findCardByName('chukan-nobue');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.katana = this.player1.findCardByName('fine-katana');
                this.paragon = this.player2.findCardByName('paragon-of-grace');
            });

            it('paragon should not make the player choosen and discard a card', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.nobue],
                    defenders: [this.paragon],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.paragon);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('paragon should not make the player randomly discard', function() {
                this.paragon.honor();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.nobue],
                    defenders: [this.paragon],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.paragon);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('upholding should let the oppponent look at the hand but not select any cards', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.nobue],
                    defenders: [],
                    provinces: ['upholding-authority']
                });

                this.player2.pass();
                this.player1.playAttachment(this.katana, this.nobue);
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('upholding-authority');
                this.upholdingAuthority = this.player2.clickCard('upholding-authority');
                expect(this.getChatLogs(2)).toContain('player1 reveals their hand: Ornate Fan');
                expect(this.player2).toHavePrompt('Choose a card to discard');
                expect(this.player2).toHaveDisabledPromptButton('Ornate Fan');
                expect(this.player2).toHavePromptButton('Don\'t discard anything');
                this.player2.clickPrompt('Don\'t discard anything');
                this.player1.clickPrompt('yes');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('PD should be able to look at the player hand but not discard', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.nobue],
                    defenders: [this.paragon],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('policy-debate');
                this.player2.clickCard(this.paragon);
                this.player2.clickCard(this.nobue);
                this.player2.clickPrompt('5');
                this.player1.clickPrompt('5');
                expect(this.getChatLogs(3)).toContain('player1 reveals their hand: Fine Katana and Ornate Fan');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

