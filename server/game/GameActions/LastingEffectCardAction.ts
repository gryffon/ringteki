const _ = require('underscore');
import { CardGameAction } from './CardGameAction';
import { Durations, EventNames, Locations, EffectNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');
import { LastingEffectGeneralProperties } from './LastingEffectAction';

export interface LastingEffectCardProperties extends LastingEffectGeneralProperties {
    targetLocation?: Locations | Locations[];
}

export class LastingEffectCardAction extends CardGameAction {
    name = 'applyLastingEffect';
    eventName = EventNames.OnEffectApplied;
    effect = 'apply a lasting effect to {0}';
    defaultProperties: LastingEffectCardProperties = {
        duration: Durations.UntilEndOfConflict,
        effect: []
    };
    constructor(properties: LastingEffectCardProperties | ((context: AbilityContext) => LastingEffectCardProperties)) {
        super(properties);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): LastingEffectCardProperties {
        let properties = super.getProperties(context, additionalProperties) as LastingEffectCardProperties;
        if(!Array.isArray(properties.effect)) {
            properties.effect = [properties.effect];
        }
        return properties;
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        if(card.location !== Locations.PlayArea && properties.targetLocation !== Locations.Provinces) {
            return false;
        }
        properties.effect = properties.effect.map(factory => factory(context.game, context.source, properties));
        const lastingEffectRestrictions = card.getEffects(EffectNames.CannotApplyLastingEffects);
        return super.canAffect(card, context) && properties.effect.some(props => 
            props.effect.canBeApplied(card) && !lastingEffectRestrictions.some(condition => condition(props.effect))
        );
    }

    eventHandler(event, additionalProperties): void {
        const properties = this.getProperties(event.context, additionalProperties);
        const lastingEffectRestrictions = event.card.getEffects(EffectNames.CannotApplyLastingEffects);
        const effectProperties = Object.assign({ match: event.card, location: Locations.Any }, _.omit(properties, 'effect'));
        let effects = properties.effect.map(factory => factory(event.context.game, event.context.source, effectProperties));
        effects = effects.filter(props =>
            props.effect.canBeApplied(event.card) && lastingEffectRestrictions.every(condition => condition(props.effect))
        );
        for(const effect of effects) {
            event.context.game.effectEngine.add(effect)
        }
    }
}
