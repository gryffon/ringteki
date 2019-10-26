describe('Student of Anatomies', function() {
    integration(function() {
        describe('Student of Anatomies\'s ability', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['student-of-anatomies', 'eager-scout']
                    },
                    player2: {
                        inPlay: ['agasha-swordsmith']
                    }
                });

                this.studentOfAnatomies = this.player1.findCardByName('student-of-anatomies');
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.agashaSwordsmith = this.player2.findCardByName('agasha-swordsmith');
            });

            it('blanks a character.', function () {
                this.player1.clickCard(this.studentOfAnatomies);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickCard(this.eagerScout);

                expect(this.eagerScout.location).toBe('dynasty discard pile');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('action window');
                expect(this.agashaSwordsmith.isBlank()).toBe(true);
            });

            it('blanks a character, but it should only last until the end of the phase.', function () {
                this.agashaSwordsmith.fate = 1;
                this.studentOfAnatomies.fate = 1;
                this.eagerScout.fate = 1;
                this.player1.clickCard(this.studentOfAnatomies);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickCard(this.eagerScout);

                expect(this.eagerScout.location).toBe('dynasty discard pile');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('action window');

                this.flow.finishConflictPhase();
                expect(this.agashaSwordsmith.isBlank()).toBe(false);
            });

            it('can use the student of anatomies as a sacrifice.', function () {
                this.player1.clickCard(this.studentOfAnatomies);
                this.player1.clickCard(this.agashaSwordsmith);
                this.player1.clickCard(this.studentOfAnatomies);

                expect(this.studentOfAnatomies.location).toBe('dynasty discard pile');
                this.player2.clickCard(this.agashaSwordsmith);
                expect(this.player2).toHavePrompt('action window');
                expect(this.agashaSwordsmith.isBlank()).toBe(true);
            });

            it('can blank a friendly character.', function () {
                expect(this.eagerScout.isBlank()).toBe(false);
                this.player1.clickCard(this.studentOfAnatomies);
                this.player1.clickCard(this.eagerScout);
                this.player1.clickCard(this.studentOfAnatomies);

                expect(this.eagerScout.isBlank()).toBe(true);
            });
        });
    });
});

