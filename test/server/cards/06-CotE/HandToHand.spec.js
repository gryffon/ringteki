describe('Hand to Hand', function() {
    integration(function() {
        describe('Hand to Hand\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'savvy-politician'],
                        hand: ['fine-katana', 'ornate-fan','hand-to-hand']
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'intimidating-hida','steadfast-witch-hunter'],
                        hand: ['cloud-the-mind', 'reprieve']
                    }
                });
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.savvyPolitician = this.player1.findCardByName('savvy-politician');
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.intimidatingHida = this.player2.findCardByName('intimidating-hida');
                this.steadfastWitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.fineKatana = this.player1.playAttachment('fine-katana', this.dojiWhisperer);
                this.cloudTheMind = this.player2.playAttachment('cloud-the-mind', this.savvyPolitician);
                this.ornateFan = this.player1.playAttachment('ornate-fan', this.savvyPolitician);
                this.reprieve = this.player2.playAttachment('reprieve', this.intimidatingHida);

                this.handToHand = this.player1.findCardByName('hand-to-hand');
            });

            it('should not be playable outside a military conflict', function() {
                this.player1.clickCard(this.handToHand);
                expect(this.player1).toHavePrompt('Action Window');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.savvyPolitician],
                    defenders: [this.borderlandsDefender, this.intimidatingHida]
                });
                this.player2.pass();
                this.player1.clickCard(this.handToHand);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a military conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.savvyPolitician],
                        defenders: [this.borderlandsDefender, this.intimidatingHida]
                    });
                    this.player2.pass();
                });

                it('should prompt to choose an attachment on a participating character', function() {
                    this.player1.clickCard(this.handToHand);
                    expect(this.player1).toHavePrompt('Choose an attachment');
                    expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
                    expect(this.player1).toBeAbleToSelect(this.ornateFan);
                    expect(this.player1).toBeAbleToSelect(this.cloudTheMind);
                    expect(this.player1).toBeAbleToSelect(this.reprieve);
                });

                it('should discard the chosen attachment', function() {
                    this.player1.clickCard(this.handToHand);
                    this.player1.clickCard(this.cloudTheMind);
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                });

                it('should allow your opponent to resolve the ability (ad infinitum)', function() {
                    this.player1.clickCard(this.handToHand);
                    expect(this.player1).toHavePromptButton('Cancel');
                    this.player1.clickCard(this.cloudTheMind);
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                    expect(this.player1).toHavePrompt('Waiting for opponent to use Hand to Hand');
                    expect(this.player2).toHavePrompt('Resolve Hand to Hand\'s ability again?');
                    expect(this.player2).toHavePromptButton('Yes');
                    expect(this.player2).toHavePromptButton('No');
                    this.player2.clickPrompt('Yes');
                    expect(this.getChatLogs(1)).toContain('player2 chooses to resolve Hand to Hand\'s ability again');
                    expect(this.player2).toHavePrompt('Choose an attachment');
                    expect(this.player2).not.toBeAbleToSelect(this.fineKatana);
                    expect(this.player2).toBeAbleToSelect(this.ornateFan);
                    expect(this.player2).not.toBeAbleToSelect(this.cloudTheMind);
                    expect(this.player2).toBeAbleToSelect(this.reprieve);
                    this.player2.clickCard(this.ornateFan);
                    expect(this.ornateFan.location).toBe('conflict discard pile');
                    expect(this.player1).toHavePrompt('Resolve Hand to Hand\'s ability again?');
                    expect(this.player1).toHavePromptButton('Yes');
                    expect(this.player1).toHavePromptButton('No');
                    this.player1.clickPrompt('Yes');
                    expect(this.player1).toHavePrompt('Choose an attachment');
                    expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
                    expect(this.player1).not.toBeAbleToSelect(this.ornateFan);
                    expect(this.player1).not.toBeAbleToSelect(this.cloudTheMind);
                    expect(this.player1).toBeAbleToSelect(this.reprieve);
                    this.player1.clickCard(this.reprieve);
                    expect(this.reprieve.location).toBe('conflict discard pile');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                it('should be able to be cancelled by initiator', function() {
                    this.player1.clickCard(this.handToHand);
                    expect(this.player1).toHavePromptButton('Cancel');
                    this.player1.clickCard(this.cloudTheMind);
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                    this.player2.clickPrompt('No');
                    expect(this.fineKatana.location).toBe('play area');
                    expect(this.ornateFan.location).toBe('play area');
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                    expect(this.reprieve.location).toBe('play area');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });

                it('should be able to be cancelled by opponent', function() {
                    this.player1.clickCard(this.handToHand);
                    expect(this.player1).toHavePromptButton('Cancel');
                    this.player1.clickCard(this.cloudTheMind);
                    expect(this.cloudTheMind.location).toBe('conflict discard pile');
                    this.player2.clickPrompt('Yes');
                    expect(this.player2).not.toBeAbleToSelect(this.fineKatana);
                    expect(this.player2).toBeAbleToSelect(this.ornateFan);
                    expect(this.player2).not.toBeAbleToSelect(this.cloudTheMind);
                    expect(this.player2).toBeAbleToSelect(this.reprieve);
                    this.player2.clickCard(this.ornateFan);
                    expect(this.ornateFan.location).toBe('conflict discard pile');
                    this.player1.clickPrompt('No');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });
            });
        });
    });
});
