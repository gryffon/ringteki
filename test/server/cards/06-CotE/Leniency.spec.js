describe('Leniency', function() {
    integration(function() {
        describe('When playing Leniency', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        dynastyDeck: ['shiba-tsukune', 'shiba-peacemaker', 'naive-student', 'ethereal-dreamer'],
                        hand: ['leniency', 'assassination']
                    },
                    player2: {
                        hand: ['leniency', 'fine-katana', 'display-of-power'],
                        provinces: ['defend-the-wall'],
                        inPlay: ['shinjo-outrider'],
                        dynastyDeck: ['border-rider']
                    }
                });
                this.player1.placeCardInProvince('shiba-tsukune', 'province 1');
                this.player1.placeCardInProvince('shiba-peacemaker', 'province 2');
                this.player1.placeCardInProvince('naive-student', 'province 3');
                this.player1.placeCardInProvince('ethereal-dreamer', 'province 4');
                this.player2.placeCardInProvince('border-rider', 'province 1');
                this.etherealDreamer = this.player1.findCardByName('ethereal-dreamer');
                this.naiveStudent = this.player1.findCardByName('naive-student');
                this.borderRider = this.player2.findCardByName('border-rider');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    province: 'defend-the-wall',
                    attackers: ['adept-of-the-waves'],
                    defenders: ['shinjo-outrider']
                });
            });

            it('should let you put ethereal dreamer into play instead of resolving the ring effect', function () {
                this.noMoreActions();
                this.player1.clickCard('leniency');
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.etherealDreamer);
                expect(this.etherealDreamer.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should let you put a dash mil chararcter into play instead of resolving the ring effect', function () {
                this.noMoreActions();
                this.player1.clickCard('leniency');
                expect(this.player1).toHavePrompt('Choose a character');
                this.player1.clickCard(this.naiveStudent);
                expect(this.naiveStudent.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should work with defend the wall', function () {
                this.player2.playAttachment('fine-katana', 'shinjo-outrider');
                this.noMoreActions();
                this.player2.clickCard('defend-the-wall');
                this.player2.clickCard('leniency');
                expect(this.player2).toHavePrompt('Choose a character');
                this.player2.clickCard(this.borderRider);
                expect(this.borderRider.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should work with display of power', function () {
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard('shinjo-outrider', 'any', 'opponent');
                this.noMoreActions();
                expect(this.player2).toBeAbleToSelect('display-of-power');
                this.player2.clickCard('display-of-power');
                expect(this.player2).toBeAbleToSelect('leniency');
                this.player2.clickCard('leniency');
                expect(this.player2).toHavePrompt('Choose a character');
                this.player2.clickCard(this.borderRider);
                expect(this.borderRider.location).toBe('play area');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
