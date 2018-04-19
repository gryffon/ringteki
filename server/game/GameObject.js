class GameObject {
    constructor(game, name) {
        this.game = game;
        this.name = name;
        this.id = this.name;
        this.type = '';
        this.facedown = false;
        this.effects = [];
    }

    addEffect(effect) {
        this.effects.push(effect);
    }

    removeEffect(effect) {
        this.effects = this.effects.filter(e => e !== effect);
    }

    getEffects(type) {
        let filteredEffects = this.effects.filter(effect => effect.type === type);
        return filteredEffects.map(effect => effect.getValue(this));
    }

    isUnique() {
        return false;
    }

    getType() {
        return this.type;
    }

    getPrintedFaction() {
        return null;
    }

    hasKeyword() {
        return false;
    }

    hasTrait() {
        return false;
    }

    getTraits() {
        return [];
    }
            
    isFaction() {
        return false;
    }
            
    hasToken() {
        return false;
    }

    getShortSummary() {
        return {
            id: this.id,
            label: this.name,
            name: this.name,
            facedown: this.facedown,
            type: this.getType()
        };
    }

}

module.exports = GameObject;
