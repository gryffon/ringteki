const DrawCard = require('../../../build/server/game/drawcard.js');

describe('DrawCard', function() {
    beforeEach(function() {
        this.blankEffect = jasmine.createSpyObj('blankEffect', ['getValue']);
        this.blankEffect.getValue.and.returnValue(true);
        this.blankEffect.type = 'blank';
        this.game = jasmine.createSpyObj('game', ['emitEvent', 'on']);
        this.owner = {
            game: this.game
        };
    });

    describe('canAttach()', function() {
        describe('when the card is an attachment', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: '' });
                this.attachment = new DrawCard(this.owner, { type: 'attachment' });
            });

            it('should return true', function() {
                expect(this.attachment.canAttach(this.targetCard)).toBe(true);
            });
        });

        describe('when the card is not an attachment', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: '' });
                this.attachment = new DrawCard(this.owner, { type: 'event' });
            });

            it('should return false', function() {
                expect(this.attachment.canAttach(this.targetCard)).toBe(false);
            });
        });
    });

    describe('allowAttachment()', function() {
        describe('when the target card does not allow attachments', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: 'No attachments.' });
                this.attachment = new DrawCard(this.owner, { type: 'attachment' });
            });

            it('should return false', function() {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
            });

            describe('but the target card is blank', function() {
                beforeEach(function() {
                    this.targetCard.addEffect(this.blankEffect);
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });
        });

        describe('when the target card only allows certain kinds of attachments', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: 'No attachments except weapon.' });
            });

            describe('and the card text has the target in italics', function() {
                beforeEach(function() {
                    this.targetCard = new DrawCard(this.owner, { type: 'character', text: 'No attachments except weapon.' });
                });

                describe('and the attachment has that trait', function() {
                    beforeEach(function() {
                        this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition', 'weapon'] });
                    });

                    it('should return true', function() {
                        expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                    });
                });
            });

            describe('and the attachment has that trait', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition', 'weapon'] });
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment does not have that trait', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition'] });
                });

                it('should return false', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
                });

                describe('but the target card is blank', function() {
                    beforeEach(function() {
                        this.targetCard.addEffect(this.blankEffect);
                    });

                    it('should return true', function() {
                        expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                    });
                });
            });
        });

        describe('when the target card only allows two kinds of attachments', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: 'No attachments except monk or tattoo.' });
            });

            describe('and the attachment has the first of those traits', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['monk', 'tattooed'] });
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment has the second of those traits', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition', 'tattoo'] });
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment has both of those traits', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition', 'tattoo', 'monk'] });
                });

                it('should return true', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                });
            });

            describe('and the attachment does not have any of those traits', function() {
                beforeEach(function() {
                    this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: ['condition'] });
                });

                it('should return false', function() {
                    expect(this.targetCard.allowAttachment(this.attachment)).toBe(false);
                });

                describe('but the target card is blank', function() {
                    beforeEach(function() {
                        this.targetCard.addEffect(this.blankEffect);
                    });

                    it('should return true', function() {
                        expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
                    });
                });
            });
        });

        describe('when there are no restrictions', function() {
            beforeEach(function() {
                this.targetCard = new DrawCard(this.owner, { type: 'character', text: '' });
                this.attachment = new DrawCard(this.owner, { type: 'attachment', traits: [] });
            });

            it('should return true', function() {
                expect(this.targetCard.allowAttachment(this.attachment)).toBe(true);
            });
        });
    });
});
