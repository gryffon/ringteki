describe('Acolyte of Koyane', function() {
    integration(function() {
        describe('Acolyte of Koyane\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['acolyte-of-koyane', 'guardian-kami']
                    },
                    player2: {
                        inPlay: ['akodo-gunso', 'wandering-ronin']
                    }
                });

                this.acolyteOfKoyane = this.player1.findCardByName('acolyte-of-koyane');
                this.guardianKami = this.player1.findCardByName('guardian-kami');

                this.akodoGunso = this.player2.findCardByName('akodo-gunso');
                this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
            });

            it('should not trigger outside of a political conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.acolyteOfKoyane);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.acolyteOfKoyane],
                    defenders: [],
                    type: 'military'
                });
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.acolyteOfKoyane);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should prompt you to choose a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.acolyteOfKoyane);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.guardianKami);
                expect(this.player1).not.toBeAbleToSelect(this.acolyteOfKoyane);
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).not.toBeAbleToSelect(this.wanderingRonin);
            });

            it('should prompt you to choose a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.acolyteOfKoyane);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.guardianKami);
                expect(this.player1).not.toBeAbleToSelect(this.acolyteOfKoyane);
                expect(this.player1).toBeAbleToSelect(this.akodoGunso);
                expect(this.player1).not.toBeAbleToSelect(this.wanderingRonin);
            });

            it('should prompt you to choose the target character to gain or lose pride', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.acolyteOfKoyane);
                this.player1.clickCard(this.akodoGunso);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Gain Pride');
                expect(this.player1).toHavePromptButton('Lose Pride');
            });

            it('should make the target character lose pride if chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.acolyteOfKoyane);
                this.player1.clickCard(this.akodoGunso);
                this.player1.clickPrompt('Lose Pride');
                expect(this.akodoGunso.hasKeyword('pride')).toBe(false);
                expect(this.getChatLogs(3)).toContain('player1 uses Acolyte of Koyane to make Akodo Gunsō lose Pride until the end of the conflict');
            });

            it('should make the target character gain pride if chosen', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.guardianKami],
                    defenders: [this.akodoGunso],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.acolyteOfKoyane);
                this.player1.clickCard(this.guardianKami);
                this.player1.clickPrompt('Gain Pride');
                expect(this.guardianKami.hasKeyword('pride')).toBe(true);
                expect(this.getChatLogs(3)).toContain('player1 uses Acolyte of Koyane to give Guardian Kami Pride until the end of the conflict');
            });
        });
    });
});

