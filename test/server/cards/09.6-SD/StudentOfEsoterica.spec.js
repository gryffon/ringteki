describe('Student of Esoterica', function() {
    integration(function() {
        describe('Student of Esoterica\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['student-of-esoterica', 'student-of-esoterica'],
                        hand: ['against-the-waves', 'consumed-by-five-fires', 'the-mirror-s-gaze', 'daimyo-s-favor', 'embrace-the-void', 'mono-no-aware']
                    },
                    player2: {
                        inPlay: ['doji-challenger']
                    }
                });
                this.student1 = this.player1.filterCardsByName('student-of-esoterica')[0];
                this.student2 = this.player1.filterCardsByName('student-of-esoterica')[1];
                this.monoNoAware = this.player1.findCardByName('mono-no-aware');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.challenger.fate = 6;
                this.student1.fate = 4;
                this.student2.fate = 3;

                this.etv = this.player1.findCardByName('embrace-the-void');
                this.player1.playAttachment(this.etv, this.student2);
                this.player2.pass();
            });

            it('should allow the player to choose whether to take fate from the character or their fate pool', function() {
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
            });

            it('should allow the player to choose to take fate from the second student if able', function() {
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
            });

            it('should not allow the player to choose to take fate from the second student if no fate needs to be taken', function() {
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('1');
                expect(this.player1).not.toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.student1.bowed).toBe(true);
            });

            it('should pay with character fate when selected', function() {
                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                this.player1.clickPrompt('1');
                expect(this.player1.fate).toBe(playerFate);
                expect(this.student1.fate).toBe(bodyFate - 1);
                expect(this.student1.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should pay with own fate when selected', function() {
                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('0');
                expect(this.player1.fate).toBe(playerFate - 1);
                expect(this.student1.fate).toBe(bodyFate);
                expect(this.student2.fate).toBe(bodyFate2);
                expect(this.student1.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should allow triggering Embrace the Void', function() {
                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;

                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.student1);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('0');
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.etv);
                this.player1.clickCard(this.etv);
                expect(this.player1.fate).toBe(playerFate + 1);
                expect(this.student1.fate).toBe(bodyFate);
                expect(this.student2.fate).toBe(bodyFate2 - 1);
                expect(this.student1.bowed).toBe(true);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should correctly offer options when the player doesn\'t have enough fate in their pool', function() {
                this.player1.fate = 3;

                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;

                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(6);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('2');
                expect(this.player1.currentButtons).toContain('3');
                expect(this.player1.currentButtons).toContain('4');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('3');

                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(4);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('2');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('1');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.pass();

                expect(this.player1.fate).toBe(playerFate - 1);
                expect(this.student1.fate).toBe(bodyFate - 3);
                expect(this.student2.fate).toBe(bodyFate2 - 1);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should work with attachments', function() {
                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;

                this.daimyosFavor = this.player1.playAttachment('daimyo-s-favor', this.student1);
                this.player2.pass();
                this.player1.clickCard(this.daimyosFavor);
                this.player2.pass();
                this.mirrorsGaze = this.player1.clickCard('the-mirror-s-gaze');
                expect(this.player1).toHavePrompt('The Mirror\'s Gaze');
                this.player1.clickCard(this.student1);
                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('0');
                expect(this.player1.currentButtons).toContain('1');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('1');
                expect(this.mirrorsGaze.location).toBe('play area');
                expect(this.player1.fate).toBe(playerFate);
                expect(this.student1.fate).toBe(bodyFate - 1);
                expect(this.student2.fate).toBe(bodyFate2);
            });

            it('should not offer a discount on a non-spell', function() {
                this.player1.fate = 3;

                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;
                let challengerFate = this.challenger.fate;

                this.player1.clickCard(this.monoNoAware);
                expect(this.player1).not.toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.pass();
                expect(this.player1.fate).toBe(playerFate - 3);
                expect(this.student1.fate).toBe(bodyFate - 1);
                expect(this.student2.fate).toBe(bodyFate2 - 1);
                expect(this.challenger.fate).toBe(challengerFate - 1);
            });
        });

        describe('Student of Esoterica\'s ability (Ring of Binding interaction)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        fate: 2,
                        inPlay: ['student-of-esoterica', 'student-of-esoterica'],
                        hand: ['consumed-by-five-fires', 'ring-of-binding']
                    },
                    player2: {
                        inPlay: ['doji-challenger']
                    }
                });
                this.student1 = this.player1.filterCardsByName('student-of-esoterica')[0];
                this.student2 = this.player1.filterCardsByName('student-of-esoterica')[1];
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.challenger.fate = 6;
                this.student1.fate = 4;
                this.student2.fate = 3;

                this.player1.playAttachment('ring-of-binding', this.student1);
                this.player2.pass();
            });

            it('should correctly offer options', function() {
                this.player1.fate = 3;

                let playerFate = this.player1.fate;
                let bodyFate = this.student1.fate;
                let bodyFate2 = this.student2.fate;

                this.player1.clickCard('consumed-by-five-fires');

                expect(this.player1).toHavePrompt('Choose amount of fate to spend from the Student of Esoterica');
                expect(this.player1.currentButtons.length).toBe(3);
                expect(this.player1.currentButtons).toContain('2');
                expect(this.player1.currentButtons).toContain('3');
                expect(this.player1.currentButtons).toContain('Cancel');
                this.player1.clickPrompt('3');

                expect(this.player1.fate).toBe(playerFate - 2);
                expect(this.student1.fate).toBe(bodyFate);
                expect(this.student2.fate).toBe(bodyFate2 - 3);
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should not let you play the card if you don\'t have enough fate when student is excluded', function() {
                this.player1.fate = 1;
                this.player1.clickCard('consumed-by-five-fires');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
