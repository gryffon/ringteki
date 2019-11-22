const _ = require('underscore');

class EffectValue {
    constructor(value) {
        this.value = value;
        if(_.isUndefined(value)) {
            this.value = true;
        }
        this.context = {};
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    recalculate() {
        return false;
    }

    setContext(context) {
        this.context = context;
    }

    reset() {
    }

    apply(target) { // eslint-disable-line no-unused-vars
    }

    unapply(target) { // eslint-disable-line no-unused-vars
    }
}

module.exports = EffectValue;
