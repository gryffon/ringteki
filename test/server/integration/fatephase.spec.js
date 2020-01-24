describe('(4) Fate Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    stronghold: 'city-of-the-open-hand',
                    inPlay: ['doji-whisperer', 'doji-challenger', 'doji-hotaru', 'doji-representative'],
                    hand: ['jade-masterpiece']
                },
                player2: {
                    honor: 11,
                    hand: ['daimyo-s-favor'],
                    inPlay: ['agasha-swordsmith', 'mirumoto-raitsugu', 'doomed-shugenja', 'kitsuki-investigator']
                }
            });

            this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
            this.dojiWhisperer.fate = 1;
            this.dojiChallenger = this.player1.findCardByName('doji-challenger');
            this.dojiChallenger.fate = 2;
            this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
            this.dojiRepresentative = this.player1.findCardByName('doji-representative');

            this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            this.agashaSwordsmith.fate = 2;
            this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
            this.mirumotoRaitsugu.fate = 1;
            this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
            this.kitsukiInvestigator = this.player2.findCardByName('kitsuki-investigator');

            this.raiseEventSpy = spyOn(this.game, 'raiseEvent').and.callThrough();

            this.player1.claimRing('air');
            this.player2.claimRing('earth');

            this.game.rings.fire.fate = 1;

            this.flow.finishConflictPhase();
        });

        describe('Prior to (4.1) \'Fate Phase begins\' step', function() {
            it('should raise an onPhaseCreated event', function() {
                expect(this.game.currentPhase).toBe('fate');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseCreated', { phase: 'fate' }, jasmine.any(Function));
            });
        });

        describe('(4.1) \'Fate Phase begins\' step', function() {
            it('should raise an onPhaseStarted event', function() {
                expect(this.game.currentPhase).toBe('fate');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseStarted', { phase: 'fate' }, jasmine.any(Function));
            });
        });

        describe('(4.2) "Discard characters with no fate" step', () => {
            it('should prompt the first player to discard', function() {
                expect(this.player1).toHavePrompt('Choose character to discard\n(or click Done to discard all characters with no fate)');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player2).toHavePrompt('Waiting for opponent to discard characters with no fate');
            });

            it('should allow the first player to select characters they control with no fate', function() {
                expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
                expect(this.player1).not.toBeAbleToSelect(this.dojiChallenger);
                expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                expect(this.player1).toBeAbleToSelect(this.dojiRepresentative);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player1).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.kitsukiInvestigator);
            });

            it('should discard a character with no fate when clicked by the first player', function() {
                this.player1.clickCard(this.dojiHotaru);
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiChallenger.location).toBe('play area');
                expect(this.dojiHotaru.location).toBe('dynasty discard pile');
                expect(this.dojiRepresentative.location).toBe('play area');
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('play area');
                expect(this.kitsukiInvestigator.location).toBe('play area');
            });

            it('should not discard a character with fate when clicked by the first player', function() {
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiChallenger.location).toBe('play area');
                expect(this.dojiHotaru.location).toBe('play area');
                expect(this.dojiRepresentative.location).toBe('play area');
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('play area');
                expect(this.kitsukiInvestigator.location).toBe('play area');
            });

            it('should auto discard all characters if \'Done\' is clicked by the first player', function() {
                this.player1.clickPrompt('Done');
                expect(this.dojiWhisperer.location).toBe('play area');
                expect(this.dojiChallenger.location).toBe('play area');
                expect(this.dojiHotaru.location).toBe('dynasty discard pile');
                expect(this.dojiRepresentative.location).toBe('dynasty discard pile');
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('play area');
                expect(this.kitsukiInvestigator.location).toBe('play area');
            });

            it('should prompt the second player to discard after the first is complete', function() {
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Choose character to discard\n(or click Done to discard all characters with no fate)');
                expect(this.player2).toHavePromptButton('Done');
                expect(this.player1).toHavePrompt('Waiting for opponent to discard characters with no fate');
            });

            it('should allow the second player to select characters they control with no fate', function() {
                this.player1.clickPrompt('Done');
                expect(this.player2).not.toBeAbleToSelect(this.agashaSwordsmith);
                expect(this.player2).not.toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player2).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player2).toBeAbleToSelect(this.kitsukiInvestigator);
            });

            it('should discard a character with no fate when clicked by the second player', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.doomedShugenja);
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('dynasty discard pile');
                expect(this.kitsukiInvestigator.location).toBe('play area');
            });

            it('should not discard a character with fate when clicked by the second player', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('play area');
                expect(this.kitsukiInvestigator.location).toBe('play area');
            });

            it('should auto discard all characters if \'Done\' is clicked by the second player', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.agashaSwordsmith.location).toBe('play area');
                expect(this.mirumotoRaitsugu.location).toBe('play area');
                expect(this.doomedShugenja.location).toBe('dynasty discard pile');
                expect(this.kitsukiInvestigator.location).toBe('dynasty discard pile');
            });
        });

        describe('(4.3) "Remove fate from characters" step', () => {
            beforeEach(function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it('should simultaneously remove 1 fate from all characters', function() {
                expect(this.dojiWhisperer.fate).toBe(0);
                expect(this.dojiChallenger.fate).toBe(1);
                expect(this.agashaSwordsmith.fate).toBe(1);
                expect(this.mirumotoRaitsugu.fate).toBe(0);
            });
        });

        describe('(4.4) "Place fate on unclaimed rings" step', () => {
            beforeEach(function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it('should add 1 fate to all unclaimed rings', function() {
                expect(this.game.rings.air.fate).toBe(0);
                expect(this.game.rings.earth.fate).toBe(0);
                expect(this.game.rings.fire.fate).toBe(2);
                expect(this.game.rings.void.fate).toBe(1);
                expect(this.game.rings.water.fate).toBe(1);
            });

            it('should raise an onPlaceFateOnUnclaimedRings event', function() {
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPlaceFateOnUnclaimedRings', {}, jasmine.any(Function));
            });
        });

        describe('(post 4.4) "Action Window" step', () => {
            it(', if player.promptedActionWindows.fate = true, should prompt the first player to play an action or pass', function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Initiate an action');
                expect(this.player1).toHavePromptButton('Pass');
                expect(this.player2).toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it(', if player.promptedActionWindows.fate = false, should not prompt the first player to play an action or pass', function() {
                this.player1.player.promptedActionWindows.fate = false;
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.player1).not.toHavePrompt('Initiate an action');
                expect(this.player2).not.toHavePrompt('Waiting for opponent to take an action or pass');
            });

            it(', if player.promptedActionWindows.fate = true, should prompt the second player to play an action or pass after the first', function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
                expect(this.player2).toHavePrompt('Initiate an action');
                expect(this.player2).toHavePromptButton('Pass');
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
            });
        });

        describe('(4.5) "Ready" step', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                //4.4 action window
                this.dojiWhisperer.bowed = true;
                this.agashaSwordsmith.bowed = true;
                this.jadeMasterpiece = this.player1.playAttachment('jade-masterpiece', this.dojiWhisperer);
                this.daimyosFavor = this.player2.playAttachment('daimyo-s-favor', this.agashaSwordsmith);

                this.player1.clickCard(this.jadeMasterpiece);
                this.player1.clickRing('fire');
                this.player1.clickRing('void');
                this.player2.clickCard(this.daimyosFavor);
                this.cityOfTheOpenHand = this.player1.clickCard('city-of-the-open-hand');
                this.player1.clickPrompt('Gain 1 Honor');
            });

            it('should ready characters', function() {
                expect(this.dojiWhisperer.bowed).toBe(true);
                expect(this.agashaSwordsmith.bowed).toBe(true);
                this.noMoreActions();
                expect(this.dojiWhisperer.bowed).toBe(false);
                expect(this.agashaSwordsmith.bowed).toBe(false);
            });

            it('should ready attachments', function() {
                expect(this.jadeMasterpiece.bowed).toBe(true);
                expect(this.daimyosFavor.bowed).toBe(true);
                this.noMoreActions();
                expect(this.jadeMasterpiece.bowed).toBe(false);
                expect(this.daimyosFavor.bowed).toBe(false);
            });

            it('should ready strongholds', function() {
                expect(this.cityOfTheOpenHand.bowed).toBe(true);
                this.noMoreActions();
                expect(this.cityOfTheOpenHand.bowed).toBe(false);
            });
        });

        describe('(4.6) "Discard from Provinces" step', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                this.shameful1 = this.player1.findCardByName('shameful-display', 'province 2');
                this.shameful2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.adept1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
                this.adept2 = this.player2.findCardByName('adept-of-the-waves', 'province 1');

                this.adept3 = this.player1.findCardByName('adept-of-the-waves', 'province 2');
                this.adept4 = this.player2.findCardByName('adept-of-the-waves', 'province 2');

                this.adept5 = this.player1.findCardByName('adept-of-the-waves', 'province 3');
                this.adept6 = this.player2.findCardByName('adept-of-the-waves', 'province 3');

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.shameful1.isBroken = true;
                this.shameful2.isBroken = true;

                this.adept1.facedown = false;
                this.adept2.facedown = false;
                this.adept3.facedown = false;
                this.adept4.facedown = false;
                this.adept5.facedown = true;
                this.adept6.facedown = true;

                //4.4 action window
                this.player1.pass();
                this.player2.pass();
            });

            it('should allow you to select faceup cards in unbroken provinces and discard them', function() {
                expect(this.player1).toBeAbleToSelect(this.adept1);
                expect(this.player1).not.toBeAbleToSelect(this.adept3);
                expect(this.player1).not.toBeAbleToSelect(this.adept5);
                this.player1.clickCard(this.adept1);
                this.player1.clickPrompt('Done');
                expect(this.adept1.location).toBe('dynasty discard pile');

                expect(this.player2).toBeAbleToSelect(this.adept2);
                expect(this.player2).not.toBeAbleToSelect(this.adept4);
                expect(this.player2).not.toBeAbleToSelect(this.adept6);
                this.player2.clickCard(this.adept2);
                this.player2.clickPrompt('Done');
                expect(this.adept2.location).toBe('dynasty discard pile');
            });

            it('should automatically discard faceup cards in broken provinces', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.adept3.location).toBe('dynasty discard pile');
                expect(this.adept4.location).toBe('dynasty discard pile');
            });
        });

        describe('(4.7) "Return Rings" step', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                this.adept1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
                this.adept2 = this.player2.findCardByName('adept-of-the-waves', 'province 1');
                this.adept1.facedown = false;
                this.adept2.facedown = false;

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                //4.4 action window
                this.player1.pass();
                this.player2.pass();
            });

            it('should return claimed rings', function() {
                expect(this.game.rings.air.claimedBy).toBe('player1');
                expect(this.game.rings.earth.claimedBy).toBe('player2');
                expect(this.game.rings.fire.claimedBy).toBe('');
                expect(this.game.rings.void.claimedBy).toBe('');
                expect(this.game.rings.water.claimedBy).toBe('');

                //4.6
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.game.rings.air.claimedBy).toBe('');
                expect(this.game.rings.earth.claimedBy).toBe('');
                expect(this.game.rings.fire.claimedBy).toBe('');
                expect(this.game.rings.void.claimedBy).toBe('');
                expect(this.game.rings.water.claimedBy).toBe('');
            });
        });

        describe('(4.8) "Pass First Player Token" step', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                this.adept1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
                this.adept2 = this.player2.findCardByName('adept-of-the-waves', 'province 1');
                this.adept1.facedown = false;
                this.adept2.facedown = false;

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                //4.4 action window
                this.player1.pass();
                this.player2.pass();

                //4.6
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it('player2 should have the first option to end the round', function() {
                expect(this.player1).toHavePrompt('Waiting for opponent to end the round');
            });
        });

        describe('(4.9) "Fate phase ends" step', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                this.adept1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
                this.adept2 = this.player2.findCardByName('adept-of-the-waves', 'province 1');
                this.adept1.facedown = false;
                this.adept2.facedown = false;

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                //4.4 action window
                this.player1.pass();
                this.player2.pass();

                //4.6
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                //End of Round
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');
            });

            it('should raise an onPhaseEnded event', function() {
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.raiseEventSpy).toHaveBeenCalledWith('onPhaseEnded', { phase: 'fate' });
            });
        });
    });
});
