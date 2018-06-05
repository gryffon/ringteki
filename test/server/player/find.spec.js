const Player = require('../../../server/game/player.js');

describe('the Player', function() {
    beforeEach(function() {
        this.game = jasmine.createSpyObj('game', ['getOtherPlayer', 'playerDecked', 'emitEvent', 'addMessage']);
        this.player = new Player('1', {username: 'Player 1', settings: {}}, true, this.game);
        this.attachment = { id: '1', label: 'Attachment', uuid: '1111', type: 'attachment' };
        this.cardWithNoAttachments = { id: '2', label: 'Character', type: 'character', uuid: '2222' };
        this.cardWithAttachment = { id: '3', label: 'Character', type: 'character', uuid: '3333', attachments: [] };
        this.cardWithAttachment.attachments.push(this.attachment);

        this.player.initialise();

        this.player.cardsInPlay.push(this.cardWithNoAttachments);
        this.player.cardsInPlay.push(this.cardWithAttachment);
    });

    describe('the findCardInPlayByUuid() function', function() {
        describe('when called for a card that isn\'t in play', function() {
            it('should return undefined', function() {
                this.card = this.player.findCardInPlayByUuid('notinplay');

                expect(this.card).toBe(undefined);
            });
        });

        describe('when called for a card that is in play', function() {
            beforeEach(function() {
                this.card = this.player.findCardInPlayByUuid('2222');
            });

            it('should return the card', function() {
                expect(this.card).not.toBe(undefined);
                expect(this.card.id).toBe('2');
            });
        });

        describe('when called for an attachment that is on a card in play', function() {
            beforeEach(function() {
                this.card = this.player.findCardInPlayByUuid('1111');
            });

            it('should return the attachment', function() {
                expect(this.card).not.toBe(undefined);
                expect(this.card.id).toBe('1');
            });
        });
    });
});
