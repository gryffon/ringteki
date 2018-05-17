const CardAbility = require('../../../server/game/CardAbility');
const GameChat = require('../../../server/game/gamechat');

describe('CardAbility', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'on']);
        this.gameSpy.gameChat = new GameChat();
        this.cardSpy = jasmine.createSpyObj('card', ['getType']);
        this.cardSpy.getType.and.returnValue('character');
        this.cardSpy.id = 'card';
        this.cardSpy.name = 'card';
        this.playerSpy = jasmine.createSpyObj('player', ['checkRestrictions']);
    });

    fdescribe('displayMessage()', function() {
        it('should return \'{0} uses {1}\' for a basic ability', function() {
            this.cardAbility = new CardAbility(this.gameSpy, this.cardSpy, {
                cost: {
                    action: { name: 'bow', cost: 'bowing {0}' }
                }
            });
            this.cardAbility.displayMessage2({
                game: this.gameSpy,
                player: this.playerSpy,
                source: this.cardSpy,
                ability: this.cardAbility,
                costs: { bow: this.cardSpy }
            });
            //console.log(this.gameSpy.addMessage.calls.allArgs()[0][1]);
        });

    });
    
});
