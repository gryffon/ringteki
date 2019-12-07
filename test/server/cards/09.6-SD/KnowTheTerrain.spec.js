describe('Know the Terrain', function() {
    integration(function() {
        describe('Know the Terrain\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider'],
                        hand: ['know-the-terrain', 'chasing-the-sun']
                    },
                    player2: {
                        inPlay: ['doji-whisperer'],
                        hand: ['know-the-terrain', 'talisman-of-the-sun'],
                        provinces: ['endless-plains', 'rally-to-the-cause', 'secret-cache', 'manicured-garden'],
                        role: 'keeper-of-void'
                    }
                });
                this.endless = this.player2.findCardByName('endless-plains');
                this.rally = this.player2.findCardByName('rally-to-the-cause');
                this.cache = this.player2.findCardByName('secret-cache');
                this.garden = this.player2.findCardByName('manicured-garden');
                this.shameful = this.player2.findCardByName('shameful-display', 'stronghold province');

                this.rider = this.player1.findCardByName('border-rider');
                this.p1Terrain = this.player1.findCardByName('know-the-terrain');
                this.chasing = this.player1.findCardByName('chasing-the-sun');

                this.whisperer = this.player2.findCardByName('doji-whisperer');
                this.p2Terrain = this.player2.findCardByName('know-the-terrain');
                this.talisman = this.player2.findCardByName('talisman-of-the-sun');

                this.player1.pass();
                this.player2.playAttachment(this.talisman, this.whisperer);
                this.noMoreActions();
            });

            it('should interrupt the province being revealed if it is facedown', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2Terrain);
                expect(this.rally.facedown).toBe(true);
            });

            it('should not interrupt the province being revealed if it is faceup', function() {
                this.rally.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.rally.facedown).toBe(false);
            });

            it('should not interrupt the province being revealed if it is the stronghold province', function() {
                this.rally.isBroken = true;
                this.cache.isBroken = true;
                this.garden.isBroken = true;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.shameful
                });
                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.shameful.facedown).toBe(false);
            });

            it('should not interrupt a province being revealed after conflict declaration', function() {
                this.rally.facedown = false;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    defenders: [],
                    province: this.rally
                });

                this.player2.clickCard(this.talisman);
                this.player2.clickCard(this.endless);
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should let you select a facedown unbroken non-stronghold province that is not being attacked', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2Terrain);
                expect(this.rally.facedown).toBe(true);
                this.player2.clickCard(this.p2Terrain);
                expect(this.player2).not.toBeAbleToSelect(this.rally);
                expect(this.player2).toBeAbleToSelect(this.endless);
                expect(this.player2).toBeAbleToSelect(this.cache);
                expect(this.player2).toBeAbleToSelect(this.garden);
                expect(this.player2).not.toBeAbleToSelect(this.shameful);
            });

            it('should not let you select faceup or broken provinces', function() {
                this.cache.facedown = false;
                this.endless.facedown = false;
                this.endless.isBroken = true;
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2Terrain);
                expect(this.rally.facedown).toBe(true);
                this.player2.clickCard(this.p2Terrain);
                expect(this.player2).not.toBeAbleToSelect(this.rally);
                expect(this.player2).not.toBeAbleToSelect(this.endless);
                expect(this.player2).not.toBeAbleToSelect(this.cache);
                expect(this.player2).toBeAbleToSelect(this.garden);
                expect(this.player2).not.toBeAbleToSelect(this.shameful);
            });

            it('should switch the provinces', function() {
                let rallyLocation = this.rally.location;
                let gardenLocation = this.garden.location;

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2Terrain);
                expect(this.rally.facedown).toBe(true);
                this.player2.clickCard(this.p2Terrain);
                expect(this.player2).not.toBeAbleToSelect(this.rally);
                expect(this.player2).toBeAbleToSelect(this.endless);
                expect(this.player2).toBeAbleToSelect(this.cache);
                expect(this.player2).toBeAbleToSelect(this.garden);
                expect(this.player2).not.toBeAbleToSelect(this.shameful);

                this.player2.clickCard(this.garden);
                expect(this.rally.facedown).toBe(true);
                expect(this.garden.facedown).toBe(false);
                expect(this.rally.location).toBe(gardenLocation);
                expect(this.garden.location).toBe(rallyLocation);
                expect(this.getChatLogs(3)).toContain('player2 plays Know the Terrain to switch the attacked province card');
                expect(this.getChatLogs(2)).toContain('player1 is initiating a military conflict at Manicured Garden, contesting Air Ring');
            });

            it('should allow reactions on the new provinces to be used', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.rider],
                    province: this.rally
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.p2Terrain);
                expect(this.rally.facedown).toBe(true);
                this.player2.clickCard(this.p2Terrain);
                expect(this.player2).not.toBeAbleToSelect(this.rally);
                expect(this.player2).toBeAbleToSelect(this.endless);
                expect(this.player2).toBeAbleToSelect(this.cache);
                expect(this.player2).toBeAbleToSelect(this.garden);
                expect(this.player2).not.toBeAbleToSelect(this.shameful);

                this.player2.clickCard(this.cache);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                this.player2.clickCard(this.cache);
                expect(this.player2).toHavePrompt('Select a card to put in your hand');
            });
        });
    });
});
