describe('Righteous Delegate', function() {
    integration(function() {
        describe('Righteous Delegate\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-aramoro', 'soshi-aoi', 'bayushi-manipulator']
                    },
                    player2: {
                        inPlay: ['righteous-delegate', 'shiba-tsukune', 'solemn-scholar', 'shiba-peacemaker']
                    }
                });

                this.righteousDelegate = this.player2.findCardByName('righteous-delegate');
                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.solemn = this.player2.findCardByName('solemn-scholar');
                this.peacemaker = this.player2.findCardByName('shiba-peacemaker');

                this.bayushiAramoro = this.player1.findCardByName('bayushi-aramoro');
                this.soshiAoi = this.player1.findCardByName('soshi-aoi');
                this.manipulator = this.player1.findCardByName('bayushi-manipulator');

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    defenders: [this.righteousDelegate, this.tsukune, this.solemn],
                    attackers: [this.bayushiAramoro, this.soshiAoi]
                });
            });

            it('should increase participating non-bushi\'s skill by 1 and decrease participating bushi\'s skill by 1', function () {
                this.player2.clickCard(this.righteousDelegate);

                expect(this.righteousDelegate.getMilitarySkill()).toBe(3);
                expect(this.righteousDelegate.getPoliticalSkill()).toBe(4);

                expect(this.tsukune.getMilitarySkill()).toBe(3);
                expect(this.tsukune.getPoliticalSkill()).toBe(3);

                expect(this.solemn.getMilitarySkill()).toBe(2);
                expect(this.solemn.getPoliticalSkill()).toBe(2);

                expect(this.bayushiAramoro.getMilitarySkill()).toBe(4);
                expect(this.bayushiAramoro.getPoliticalSkill()).toBe(1);

                expect(this.soshiAoi.getMilitarySkill()).toBe(3);
                expect(this.soshiAoi.getPoliticalSkill()).toBe(4);
            });

            it('should not modify non-participating character\'s skills', function () {
                this.player2.clickCard(this.righteousDelegate);

                expect(this.peacemaker.getMilitarySkill()).toBe(4);
                expect(this.peacemaker.getPoliticalSkill()).toBe(1);

                expect(this.manipulator.getMilitarySkill()).toBe(1);
                expect(this.manipulator.getPoliticalSkill()).toBe(1);
            });
        });
    });
});

