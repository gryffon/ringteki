const Conflict = require('../../../build/server/game/conflict.js');
const Player = require('../../../build/server/game/player.js');
const DrawCard = require('../../../build/server/game/drawcard.js');

describe('Conflict', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['applyGameAction', 'on', 'raiseEvent', 'reapplyStateDependentEffects', 'getFrameworkContext']);
        this.gameSpy.applyGameAction.and.callFake((type, card, handler) => {
            handler(card);
        });
        this.effectEngineSpy = jasmine.createSpyObj('effectEngine', ['checkEffects']);
        this.gameSpy.effectEngine = this.effectEngineSpy;

        this.attackingPlayer = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.defendingPlayer = new Player('2', { username: 'Player 2', settings: {} }, true, this.gameSpy);

        this.attackerCard = new DrawCard(this.attackingPlayer, {});
        spyOn(this.attackerCard, 'getSkill').and.returnValue(5);
        this.defenderCard = new DrawCard(this.defendingPlayer, {});
        spyOn(this.defenderCard, 'getSkill').and.returnValue(3);
        spyOn(this.attackerCard, 'canParticipateAsAttacker').and.returnValue(true);
        spyOn(this.defenderCard, 'canParticipateAsDefender').and.returnValue(true);

        this.conflict = new Conflict(this.gameSpy, this.attackingPlayer, this.defendingPlayer, 'military');
        this.conflict.addAttackers([this.attackerCard]);
        this.conflict.addDefenders([this.defenderCard]);
        this.conflict.calculateSkill();
    });

    describe('removeFromConflict()', function() {
        describe('when the card is an attacker', function() {
            beforeEach(function() {
                this.conflict.removeFromConflict(this.attackerCard);
            });

            it('should remove the card from the attacker list', function() {
                expect(this.conflict.attackers).not.toContain(this.attackerCard);
            });
        });

        describe('when the card is a defender', function() {
            beforeEach(function() {
                this.conflict.removeFromConflict(this.defenderCard);
            });

            it('should remove the card from the defender list', function() {
                expect(this.conflict.defenders).not.toContain(this.defenderCard);
            });
        });

        describe('when the card is not in the conflict', function() {
            beforeEach(function() {
                this.conflict.removeFromConflict(new DrawCard(this.attackingPlayer, {}));
            });

            it('should not modify the participating cards', function() {
                expect(this.conflict.attackers).toContain(this.attackerCard);
                expect(this.conflict.defenders).toContain(this.defenderCard);
            });

            it('should not modify conflict skills', function() {
                expect(this.conflict.attackerSkill).toBe(5);
                expect(this.conflict.defenderSkill).toBe(3);
            });
        });
    });
});
