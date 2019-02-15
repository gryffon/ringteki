describe('Utaku Kamoko', function() {
    integration(function() {
        describe('Utaku Kamoko', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['utaku-kamoko'],
                        hand: ['soul-beyond-reproach']
                    },
                    player2: {
                        hand: ['way-of-the-scorpion']
                    }
                });
                this.utakuKamoko = this.player1.findCardByName('utaku-kamoko');
                this.soulBeyondReproach = this.player1.findCardByName('soul-beyond-reproach');
                this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
            });

            it('should not subtract glory from skills if dishonored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.utakuKamoko],
                    defenders: []
                });
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
                expect(this.utakuKamoko.isDishonored).toBe(false);
                this.player2.clickCard(this.wayOfTheScorpion);
                this.player2.clickCard(this.utakuKamoko);
                expect(this.utakuKamoko.isDishonored).toBe(true);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
            });

            it('should still add glory to skills if honored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.utakuKamoko],
                    defenders: []
                });
                this.player2.pass();
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(3);
                expect(this.utakuKamoko.isHonored).toBe(false);
                this.player1.clickCard(this.soulBeyondReproach);
                this.player1.clickCard(this.utakuKamoko);
                expect(this.utakuKamoko.isHonored).toBe(true);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(6);
                expect(this.utakuKamoko.getMilitarySkill()).toBe(6);
            });
        });

        describe('Utaku Kamoko\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yoritomo']
                    },
                    player2: {
                        inPlay: ['utaku-kamoko'],
                        hand: ['fine-katana', 'ornate-fan']
                    }
                });
                this.yoritomo = this.player1.findCardByName('yoritomo');

                this.utakuKamoko = this.player2.findCardByName('utaku-kamoko');
                this.fineKatana = this.player2.findCardByName('fine-katana');
                this.ornateFan = this.player2.findCardByName('ornate-fan');
            });

            it('should trigger when an opponent breaks a province', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoritomo],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.utakuKamoko);
            });

            it('should not trigger if Utaku Kamoko is already honored and ready', function() {
                this.utakuKamoko.honor();
                expect(this.utakuKamoko.isHonored).toBe(true);
                expect(this.utakuKamoko.bowed).toBe(false);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoritomo],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('No');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
            });

            it('should not trigger when you break a province', function() {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.utakuKamoko],
                    defenders: []
                });
                this.noMoreActions();
                this.player2.clickPrompt('No');
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Air Ring');
            });

            describe('when triggered', function() {
                beforeEach(function() {
                    this.utakuKamoko.bowed = true;
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.yoritomo],
                        defenders: []
                    });
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player2.clickCard(this.utakuKamoko);
                });

                it('should require discarding a card as a cost', function() {
                    expect(this.player2).toHavePrompt('Select card to discard');
                    expect(this.player2).toBeAbleToSelect(this.fineKatana);
                    expect(this.player2).toBeAbleToSelect(this.ornateFan);
                    this.player2.clickCard(this.ornateFan);
                    expect(this.fineKatana.location).toBe('hand');
                    expect(this.ornateFan.location).toBe('conflict discard pile');
                });

                it('should honor and ready', function() {
                    expect(this.utakuKamoko.isHonored).toBe(false);
                    expect(this.utakuKamoko.bowed).toBe(true);
                    this.player2.clickCard(this.ornateFan);
                    expect(this.utakuKamoko.isHonored).toBe(true);
                    expect(this.utakuKamoko.bowed).toBe(false);
                });
            });
        });
    });
});
