const StaticEffect = require('./StaticEffect');

class DynamicEffect extends StaticEffect {
    constructor(type, calculate) {
        super(type);
        this.values = {};
        this.calculate = calculate;
        this.key = 'uuid';
    }

    apply(target) {
        super.apply(target);
        this.recalculate(target);
    }

    recalculate(target) {
        let oldValue = this.getValue(target);
        return oldValue !== this.setValue(target, this.calculate(target, this.context));
    }

    getKey(target) {
        return target[this.key];
    }

    getValue(target) {
        return this.values[this.getKey(target)];
    }

    setValue(target, value) {
        this.values[this.getKey(target)] = value;
        return value;
    }
}

module.exports = DynamicEffect;
