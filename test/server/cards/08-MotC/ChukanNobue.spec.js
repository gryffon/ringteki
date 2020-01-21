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
                        inPlay: ['paragon-of-grace', 'kitsuki-investigator', 'isawa-tadaka-2'],
                        hand: ['policy-debate'],
                        dynastyDiscard: ['solemn-scholar', 'keeper-initiate'],
                        provinces: ['upholding-authority']
                    }
                });

                this.nobue = this.player1.findCardByName('chukan-nobue');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.katana = this.player1.findCardByName('fine-katana');
                this.paragon = this.player2.findCardByName('paragon-of-grace');
                this.investigator = this.player2.findCardByName('kitsuki-investigator');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.scholar = this.player2.findCardByName('solemn-scholar');
                this.keeper = this.player2.findCardByName('keeper-initiate');
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

            it('investigator should see hand but not allow discarding', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.nobue],
                    defenders: [this.investigator],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.investigator);
                this.player2.clickRing('fire');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.getChatLogs(3)).toContain('Kitsuki Investigator sees Fine Katana and Ornate Fan');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('tadaka should see hand but not allow discarding', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.nobue],
                    defenders: [this.investigator],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.tadaka);
                this.player2.clickCard(this.scholar);
                this.player2.clickCard(this.keeper);
                this.player2.clickPrompt('Done');
                expect(this.scholar.location).toBe('removed from game');
                expect(this.keeper.location).toBe('removed from game');
                expect(this.getChatLogs(4)).toContain('player2 uses Isawa Tadaka, removing Solemn Scholar and Keeper Initiate from the game to look at 2 random cards in player1\'s hand');
                expect(this.getChatLogs(3).includes('Isawa Tadaka sees Fine Katana and Ornate Fan') || this.getChatLogs(3).includes('Isawa Tadaka sees Ornate Fan and Fine Katana')).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('tadaka should not see entire hand', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.nobue],
                    defenders: [this.investigator],
                    provinces: ['upholding-authority']
                });

                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.tadaka);
                this.player2.clickCard(this.scholar);
                this.player2.clickPrompt('Done');
                expect(this.scholar.location).toBe('removed from game');
                expect(this.getChatLogs(4)).toContain('player2 uses Isawa Tadaka, removing Solemn Scholar from the game to look at 1 random card in player1\'s hand');
                expect(this.getChatLogs(3).includes('Isawa Tadaka sees Fine Katana') || this.getChatLogs(3).includes('Isawa Tadaka sees Ornate Fan')).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
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

