import { CardTypes } from "./Constants";

class StatModifier {
    amount: number;
    name: string;
    countsAsBase: boolean;
    type: CardTypes;
    overrides: boolean;

    constructor(amount: number, name: string, overrides: boolean, countsAsBase: boolean, type: CardTypes) {
        this.amount = amount;
        this.name = name;
        this.overrides = overrides;
        this.countsAsBase = countsAsBase;
        this.type = type;
    }

    static getEffectName(effect) {
        if(effect && effect.context && effect.context.source) {
            return effect.context.source.name;
        }
        return 'Unknown';
    }

    static getEffectType(effect) {
        if(effect && effect.context && effect.context.source) {
            return effect.context.source.type;
        }
        return;
    }

    static getCardType(card) {
        if(card) {
            return card.type;
        }
        return;
    }

    static fromEffect(amount: number, effect: any, overrides = false, countsAsBase = false, name = `${this.getEffectName(effect)}`) {
        return new this(
            amount,
            name,
            overrides,
            countsAsBase,
            this.getEffectType(effect)
        )
    }

    static fromCard(amount: number, card: any, name, overrides = false, countsAsBase = false) {
        return new this(
            amount,
            name,
            overrides,
            countsAsBase,
            this.getCardType(card)
        )
    }

    static fromStatusToken(amount: number, name, overrides = false, countsAsBase = false) {
        return new this(
            amount,
            name,
            overrides,
            countsAsBase,
            undefined
        )
    }
}

export = StatModifier;