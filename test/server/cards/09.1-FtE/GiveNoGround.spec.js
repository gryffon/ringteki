describe('Give No Ground', function() {
    integration(function() {
        describe('Give No Ground\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'daidoji-uji', 'warrior-poet'],
                        hand: ['fiery-madness']
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'kaiu-envoy'],
                        hand: ['give-no-ground']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.daidojiUji = this.player1.findCardByName('daidoji-uji');
                this.warriorPoet = this.player1.findCardByName('warrior-poet');
                this.fieryMadness = this.player1.findCardByName('fiery-madness');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');
                this.giveNoGround = this.player2.findCardByName('give-no-ground');
            });

            it('should not be playable outside of a military conflict', function() {
                this.player1.pass();
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.clickCard(this.giveNoGround);
                expect(this.player2).toHavePrompt('Action Window');
                this.player2.pass();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiWhisperer],
                    defenders: [this.borderlandsDefender]
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.giveNoGround);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not be playable when attacking', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kaiuEnvoy],
                    defenders: [this.dojiWhisperer]
                });
                this.player1.pass();
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.giveNoGround);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt to choose a defending character you control', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.clickCard(this.giveNoGround);
                expect(this.player2).toHavePrompt('Choose a Character');
                expect(this.player2).toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player2).not.toBeAbleToSelect(this.kaiuEnvoy);
                expect(this.player2).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player2).not.toBeAbleToSelect(this.daidojiUji);
            });

            it('should give the chosen character +2 military', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.dojiWhisperer],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.clickCard(this.giveNoGround);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.getChatLogs(3)).toContain('player2 plays Give No Ground to give +2military to Borderlands Defender and prevent its skills from being reduced');
            });

            it('should revert any existing skill reduction lasting effects', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warriorPoet],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.pass();
                this.player1.clickCard(this.warriorPoet);
                expect(this.borderlandsDefender.militarySkill).toBe(2);
                expect(this.borderlandsDefender.politicalSkill).toBe(2);
                this.player2.clickCard(this.giveNoGround);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.borderlandsDefender.politicalSkill).toBe(3);
            });

            it('should prevent skills being reduced by status tokens', function() {
                this.borderlandsDefender.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warriorPoet],
                    defenders: [this.borderlandsDefender]
                });
                expect(this.borderlandsDefender.militarySkill).toBe(2);
                expect(this.borderlandsDefender.politicalSkill).toBe(2);
                this.player2.clickCard(this.giveNoGround);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.borderlandsDefender.politicalSkill).toBe(3);
            });

            it('should prevent skills being reduced by attachments', function() {
                this.player1.clickCard(this.fieryMadness);
                this.player1.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(1);
                expect(this.borderlandsDefender.politicalSkill).toBe(1);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warriorPoet],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.clickCard(this.giveNoGround);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.borderlandsDefender.politicalSkill).toBe(3);
            });

            it('should prevent skills being reduced by lasting effects', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.warriorPoet],
                    defenders: [this.borderlandsDefender]
                });
                this.player2.clickCard(this.giveNoGround);
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.borderlandsDefender.politicalSkill).toBe(3);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.warriorPoet);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.borderlandsDefender.militarySkill).toBe(5);
                expect(this.borderlandsDefender.politicalSkill).toBe(3);
            });
        });
    });
});
