describe('Regal Bearing', function() {
    integration(function() {
        describe('Regal Bearing\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-prodigy', 'akodo-makoto'],
                        hand: ['regal-bearing', 'regal-bearing', 'game-of-sadane'],
                        conflictDiscard: ['fine-katana', 'ornate-fan', 'honored-blade', 'sharpen-the-mind']
                    },
                    player2: {
                        inPlay: ['bayushi-aramoro']
                    }
                });
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.akodoMakoto = this.player1.findCardByName('akodo-makoto');
                this.regalBearing = this.player1.filterCardsByName('regal-bearing')[0];
                this.regalBearing2 = this.player1.filterCardsByName('regal-bearing')[1];
                this.gameOfSadane = this.player1.findCardByName('game-of-sadane');

                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');
                this.honoredBlade = this.player1.findCardByName('honored-blade');
                this.sharpenTheMind = this.player1.findCardByName('sharpen-the-mind');

                this.player1.moveCard(this.fineKatana, 'conflict deck');
                this.player1.moveCard(this.ornateFan, 'conflict deck');
                this.player1.moveCard(this.sharpenTheMind, 'conflict deck');
                this.player1.moveCard(this.honoredBlade, 'conflict deck');
                this.bayushiAramoro = this.player2.findCardByName('bayushi-aramoro');
            });

            it('only works during a political conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.regalBearing);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('only works during a political where you have a participating courtier', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.akodoMakoto],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.regalBearing);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('draws cards equal to the difference between honor bids', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();

                this.player1.clickCard(this.gameOfSadane);
                this.player1.clickCard(this.ikomaProdigy);
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');

                expect(this.fineKatana.location).toBe('conflict deck');
                expect(this.ornateFan.location).toBe('conflict deck');
                expect(this.sharpenTheMind.location).toBe('conflict deck');
                expect(this.honoredBlade.location).toBe('conflict deck');

                const playerHandSize = this.player1.hand.length - 1; //Playing RB
                this.player2.pass();
                this.player1.clickCard(this.regalBearing);

                expect(this.getChatLogs(5)).toContain('player1 plays Regal Bearing to set their bid dial to 1 and draw 4 cards.');
                expect(this.player1.hand.length).toBe(playerHandSize + 4);
                expect(this.regalBearing2.location).toBe('hand');
                expect(this.fineKatana.location).toBe('hand');
                expect(this.ornateFan.location).toBe('hand');
                expect(this.honoredBlade.location).toBe('hand');
                expect(this.sharpenTheMind.location).toBe('hand');
            });

            it('draws cards equal to the difference between honor bids (max once per conflict)', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });

                this.player2.pass();

                this.player1.clickCard(this.gameOfSadane);
                this.player1.clickCard(this.ikomaProdigy);
                this.player1.clickCard(this.bayushiAramoro);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('5');

                expect(this.fineKatana.location).toBe('conflict deck');
                expect(this.ornateFan.location).toBe('conflict deck');
                expect(this.sharpenTheMind.location).toBe('conflict deck');
                expect(this.honoredBlade.location).toBe('conflict deck');

                const playerHandSize = this.player1.hand.length - 1; //Playing RB
                this.player2.pass();
                this.player1.clickCard(this.regalBearing);

                expect(this.getChatLogs(5)).toContain('player1 plays Regal Bearing to set their bid dial to 1 and draw 4 cards.');
                expect(this.player1.hand.length).toBe(playerHandSize + 4);
                expect(this.fineKatana.location).toBe('hand');
                expect(this.ornateFan.location).toBe('hand');
                expect(this.honoredBlade.location).toBe('hand');
                expect(this.sharpenTheMind.location).toBe('hand');

                this.player2.pass();
                this.player1.clickCard(this.regalBearing2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('draws cards equal to the difference between honor bids and should work without having a lower bid', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.bayushiAramoro]
                });


                this.player2.pass();

                this.player1.player.showBid = 5;
                this.player2.player.showBid = 5;

                expect(this.fineKatana.location).toBe('conflict deck');
                expect(this.ornateFan.location).toBe('conflict deck');
                expect(this.honoredBlade.location).toBe('conflict deck');
                expect(this.sharpenTheMind.location).toBe('conflict deck');

                const playerHandSize = this.player1.hand.length - 1;// Playing RB
                this.player1.clickCard(this.regalBearing);

                expect(this.getChatLogs(5)).toContain('player1 plays Regal Bearing to set their bid dial to 1 and draw 4 cards.');
                expect(this.player1.player.showBid).toBe(1);
                expect(this.player1.hand.length).toBe(playerHandSize + 4);
                expect(this.fineKatana.location).toBe('hand');
                expect(this.ornateFan.location).toBe('hand');
                expect(this.sharpenTheMind.location).toBe('hand');
                expect(this.honoredBlade.location).toBe('hand');
            });
        });

        describe('Regal Bearing\'s ability when Defend your Honor is played', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-prodigy', 'akodo-makoto'],
                        hand: ['regal-bearing', 'game-of-sadane'],
                        conflictDiscard: ['fine-katana', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['yogo-hiroue'],
                        hand: ['defend-your-honor']
                    }
                });
                this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
                this.akodoMakoto = this.player1.findCardByName('akodo-makoto');
                this.regalBearing = this.player1.findCardByName('regal-bearing');
                this.gameOfSadane = this.player1.findCardByName('game-of-sadane');

                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.player1.moveCard(this.fineKatana, 'conflict deck');
                this.player1.moveCard(this.ornateFan, 'conflict deck');

                this.yogoHirue = this.player2.findCardByName('yogo-hiroue');
                this.defendYourHonor = this.player2.findCardByName('defend-your-honor');
            });

            it('should draw me 0 cards if we both bid 1 and I win the duel', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.ikomaProdigy],
                    defenders: [this.yogoHirue]
                });


                this.player2.pass();

                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;

                expect(this.fineKatana.location).toBe('conflict deck');
                expect(this.ornateFan.location).toBe('conflict deck');

                this.player1.clickCard(this.regalBearing);

                this.player2.clickCard(this.defendYourHonor);
                this.player2.clickCard(this.yogoHirue);
                this.player1.clickCard(this.ikomaProdigy);
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.getChatLogs(10)).not.toContain('player1 plays Regal Bearing to set their bid dial to 1 and draw 4 cards.');
                expect(this.getChatLogs(10)).not.toContain('player1 plays Regal Bearing to set their bid dial to 1 and draw 0 cards.');
                expect(this.player1.hand.length).toBe(1);
                expect(this.fineKatana.location).toBe('conflict deck');
                expect(this.ornateFan.location).toBe('conflict deck');
            });
        });
    });
});

