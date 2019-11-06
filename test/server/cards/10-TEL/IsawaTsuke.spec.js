describe('Isawa Tsuke', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tsuke', 'chikai-order-protector', 'isawa-masahiro'],
                    hand: ['duel-to-the-death']
                },
                player2: {
                    inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'kitsuki-investigator', 'togashi-initiate']
                }
            });

            this.isawaTsuke = this.player1.findCardByName('isawa-tsuke');
            this.chikaiOrderProtector = this.player1.findCardByName('chikai-order-protector');
            this.isawaMasahiro = this.player1.findCardByName('isawa-masahiro');
            this.duelToTheDeath = this.player1.findCardByName('duel-to-the-death');

            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.kitsukiInvestigator = this.player2.findCardByName('kitsuki-investigator');
            this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
        });

        it('should allow you to dishonor each character with the same cost of the same player after you dishonor a character of that player', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTsuke],
                defenders: [this.togashiInitiate],
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.pass();

            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickPrompt('dishonor Mirumoto Raitsugu');

            expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.isawaTsuke);

            this.player1.clickCard(this.isawaTsuke);
            expect(this.kitsukiInvestigator.isDishonored).toBe(true);
            expect(this.doomedShugenja.isDishonored).toBe(false);
            expect(this.togashiInitiate.isDishonored).toBe(false);
            expect(this.isawaMasahiro.isDishonored).toBe(false);
        });

        it('should allow you to honor each character with the same cost of the same player after you honor a character of that player', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTsuke],
                defenders: [this.togashiInitiate],
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.pass();

            this.player1.clickCard(this.isawaTsuke);
            this.player1.clickPrompt('honor Isawa Tsuke');

            expect(this.isawaTsuke.isHonored).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.isawaTsuke);

            this.player1.clickCard(this.isawaTsuke);
            expect(this.chikaiOrderProtector.isHonored).toBe(true);
        });

        it('should not work if the opponent resolves the fire ring', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.isawaTsuke],
                ring: 'fire'
            });

            this.player1.pass();
            this.player2.pass();

            this.player2.clickCard(this.isawaTsuke);
            this.player2.clickPrompt('dishonor Isawa Tsuke');

            expect(this.isawaTsuke.isDishonored).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should not work of dishonor effects in general', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTsuke],
                defenders: [this.togashiInitiate],
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.clickCard(this.duelToTheDeath);
            this.player1.clickCard(this.isawaTsuke);
            this.player1.clickCard(this.togashiInitiate);

            this.player2.clickPrompt('yes');


            expect(this.togashiInitiate.isDishonored).toBe(true);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
