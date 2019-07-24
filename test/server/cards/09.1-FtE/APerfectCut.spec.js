describe('A Perfect Cut', function() {
    integration(function() {
        describe('A Perfect Cut', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-initiate', 'kitsuki-shomon'],
                        hand: ['a-perfect-cut']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'daidoji-uji', 'sincere-challenger'],
                        hand: ['try-again-tomorrow']
                    }
                });
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.kitsukiShomon = this.player1.findCardByName('kitsuki-shomon');
                this.aPerfectCut = this.player1.findCardByName('a-perfect-cut');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.daidojiUji = this.player2.findCardByName('daidoji-uji');
                this.sincereChallenger = this.player2.findCardByName('sincere-challenger');
                this.tryAgainTomorrow = this.player2.findCardByName('try-again-tomorrow');
                this.noMoreActions();
            });

            it('should not be playable during a political conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.togashiInitiate],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).not.toHavePrompt('A Perfect Cut');
            });

            it('should not be playable on a non-bushi character', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiInitiate, this.kitsukiShomon],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
            });

            it('should be playable on a bushi character controlled by the opponent', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kitsukiShomon],
                    defenders: [this.daidojiUji]
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).toBeAbleToSelect(this.daidojiUji);
                expect(this.player1).toBeAbleToSelect(this.kitsukiShomon);
            });

            it('should give a participating character +2 Mil during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kitsukiShomon],
                    defenders: []
                });
                let militarySkill = this.kitsukiShomon.getMilitarySkill();
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).toHavePrompt('A Perfect Cut');
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.getMilitarySkill()).toBe(militarySkill + 2);
            });

            it('should honor the chosen character if they win the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kitsukiShomon],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).toHavePrompt('A Perfect Cut');
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.isHonored).toBe(false);
                this.player2.pass();
                this.player1.pass();
                expect(this.kitsukiShomon.isHonored).toBe(true);
                expect(this.getChatLogs(3)).toContain('Kitsuki Shomon is honored due to the delayed effect of A Perfect Cut');
            });

            it('should not honor the chosen character if they lose the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kitsukiShomon],
                    defenders: [this.daidojiUji]
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).toHavePrompt('A Perfect Cut');
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.isHonored).toBe(false);
                this.player2.pass();
                this.player1.pass();
                expect(this.kitsukiShomon.isHonored).toBe(false);
            });

            it('should not honor the chosen character if they are moved home, but their controller still wins the conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiInitiate, this.kitsukiShomon],
                    defenders: [this.dojiWhisperer]
                });
                this.dojiWhisperer.honor();
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                expect(this.player1).toHavePrompt('A Perfect Cut');
                this.player1.clickCard(this.kitsukiShomon);
                expect(this.kitsukiShomon.isHonored).toBe(false);
                this.player2.clickCard(this.tryAgainTomorrow);
                this.player2.clickCard(this.kitsukiShomon);
                this.player1.pass();
                this.player2.pass();
                expect(this.kitsukiShomon.isHonored).toBe(false);
            });

            it('should not honor the chosen character if they become immune to events', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.togashiInitiate, this.kitsukiShomon],
                    defenders: [this.sincereChallenger]
                });
                this.player2.pass();
                this.player1.clickCard(this.aPerfectCut);
                this.player1.clickCard(this.kitsukiShomon);
                this.player2.clickCard(this.sincereChallenger);
                this.player2.clickCard(this.kitsukiShomon);
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');
                expect(this.getChatLogs(3)).toContain('Duel Effect: Kitsuki Shomon is immune to events until the end of the conflict');
                this.noMoreActions();
                expect(this.kitsukiShomon.isHonored).toBe(false);
                expect(this.getChatLogs(2)).not.toContain('Kitsuki Shomon is honored due to the delayed effect of A Perfect Cut');
            });
        });
    });
});
