describe('Yasuki Hikaru', function() {
    integration(function() {
        describe('Yasuki Hikaru\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['akodo-gunso', 'lion-s-pride-brawler'],
                        hand: ['way-of-the-lion']
                    },
                    player2: {
                        inPlay: ['yasuki-hikaru']
                    }
                });

                this.lionsPrideBrawler = this.player1.findCardByName('lion-s-pride-brawler');
                this.akodoGunso = this.player1.findCardByName('akodo-gunso');
                this.wayOfTheLion = this.player1.findCardByName('way-of-the-lion');

                this.yasukiHikaru = this.player2.findCardByName('yasuki-hikaru');
            });

            it('should not be able to be triggered on characters with lower or equal military power', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.lionsPrideBrawler, this.akodoGunso],
                    defenders: [this.yasukiHikaru],
                    type: 'military'
                });

                this.player2.clickCard(this.yasukiHikaru);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).not.toBeAbleToSelect(this.lionsPrideBrawler);
            });

            it('should be able to be triggered on characters with higher military power', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.lionsPrideBrawler, this.akodoGunso],
                    defenders: [this.yasukiHikaru],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.wayOfTheLion);
                this.player1.clickCard(this.lionsPrideBrawler);

                this.player2.clickCard(this.yasukiHikaru);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).toBeAbleToSelect(this.lionsPrideBrawler);

                this.player2.clickCard(this.lionsPrideBrawler);
                expect(this.getChatLogs(10)).toContain('player2 uses Yasuki Hikaru to send Lion\'s Pride Brawler home');
                expect(this.lionsPrideBrawler.isParticipating()).toBe(false);
            });

            it('should be able to be triggered on characters with higher military power during political', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.lionsPrideBrawler, this.akodoGunso],
                    defenders: [this.yasukiHikaru],
                    type: 'political'
                });

                this.player2.pass();
                this.player1.clickCard(this.wayOfTheLion);
                this.player1.clickCard(this.lionsPrideBrawler);

                this.player2.clickCard(this.yasukiHikaru);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).toBeAbleToSelect(this.lionsPrideBrawler);

                this.player2.clickCard(this.lionsPrideBrawler);
                expect(this.getChatLogs(10)).toContain('player2 uses Yasuki Hikaru to send Lion\'s Pride Brawler home');
                expect(this.lionsPrideBrawler.isParticipating()).toBe(false);
            });

            it('should not work when Yasuki Hikaru is the attacker', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    attackers: [this.yasukiHikaru],
                    defenders: [this.lionsPrideBrawler, this.akodoGunso],
                    type: 'military'
                });

                this.player1.clickCard(this.wayOfTheLion);
                this.player1.clickCard(this.lionsPrideBrawler);

                this.player2.clickCard(this.yasukiHikaru);
                expect(this.player2).not.toBeAbleToSelect(this.akodoGunso);
                expect(this.player2).not.toBeAbleToSelect(this.lionsPrideBrawler);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

