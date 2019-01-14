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

    setContext(context) {
        this.context = context;
    }

    reset() {
    }

    apply(target) {
    }

    unapply(target) {
    }
}

module.exports = EffectValue;
