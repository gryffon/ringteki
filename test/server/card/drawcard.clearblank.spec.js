const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['emitEvent', 'addMessage', 'applyGameAction']);
        this.player = { game: this.game };
        this.card = new DrawCard(this.player, {});
        this.card.setBlank();
    });

    describe('clearBlank()', function() {
        it('should remove blanking', function() {
            this.card.clearBlank();
            expect(this.card.isBlank()).toBe(false);
        });

        xdescribe('when the card has attachments', function() {
            beforeEach(function() {
                this.attachment = { canAttach: () => true };
                this.card.attachments.push(this.attachment);
            });

            describe('and it will still be valid after unblanking', function() {
                beforeEach(function() {
                    spyOn(this.card, 'allowAttachment').and.returnValue(true);
                });

                it('should not discard the attachment', function() {
                    this.card.clearBlank();
                    expect(this.game.applyGameAction).not.toHaveBeenCalled();
                });
            });

            describe('and it will no longer be valid after unblanking', function() {
                beforeEach(function() {
                    spyOn(this.card, 'allowAttachment').and.returnValue(false);
                });

                it('should discard the attachment without allowing saves', function() {
                    this.card.clearBlank();
                    expect(this.game.applyGameAction).toHaveBeenCalledWith(null, { discardFromPlay: [this.attachment] });
                });
            });
        });
    });
});
