import { CardGameAction, CardActionProperties} from './CardGameAction';
import { CardTypes, Locations, EffectNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import BaseCard = require('../basecard');

export interface MoveCardProperties extends CardActionProperties {
    destination?: Locations;
    switch?: boolean;
    shuffle?: boolean;
    faceup?: boolean;
    bottom?: boolean;
    changePlayer?: boolean;
}

export class MoveCardAction extends CardGameAction {
    name = 'move';
    targetType = [CardTypes.Character, CardTypes.Attachment, CardTypes.Event, CardTypes.Holding];
    defaultProperties: MoveCardProperties = {
        destination: null,
        switch: false,
        shuffle: false,
        faceup: false,
        bottom: false,
        changePlayer: false
    };
    constructor(properties: MoveCardProperties | ((context: AbilityContext) => MoveCardProperties)) {
        super(properties);
    }

    getCostMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as MoveCardProperties;        
        return ['shuffling {0} into their deck', [properties.target]];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as MoveCardProperties;
        let destinationController = Array.isArray(properties.target) ?
            (properties.changePlayer ? properties.target[0].controller.opponent : properties.target[0].controller) :
            (properties.changePlayer ? properties.target.controller.opponent : properties.target.controller);
        if(properties.shuffle) {
            return ['shuffle {0} into {1}\'s {2}', [properties.target, destinationController, properties.destination]]
        }
        return [
            'move {0} to ' + (properties.bottom ? 'the bottom of ' : '') + '{1}\'s {2}',
            [properties.target, destinationController, properties.destination]
        ];
    }

    canAffect(card: BaseCard, context: AbilityContext, additionalProperties = {}): boolean {
        const { changePlayer } = this.getProperties(context, additionalProperties) as MoveCardProperties;
        return (!changePlayer || card.checkRestrictions(EffectNames.TakeControl, context) && !card.anotherUniqueInPlay(context.player)) &&
            card.location !== Locations.PlayArea && super.canAffect(card, context);
    }

    eventHandler(event, additionalProperties = {}): void {
        let context = event.context;
        let card = event.card;
        event.cardStateWhenMoved = card.createSnapshot();
        let properties = this.getProperties(context, additionalProperties) as MoveCardProperties;        
        if(properties.switch) {
            let otherCard = card.controller.getDynastyCardInProvince(properties.destination);
            card.owner.moveCard(otherCard, card.location);
        } else {
            this.checkForRefillProvince(card, event, additionalProperties);
        }
        const player = properties.changePlayer && card.controller.opponent ? card.controller.opponent : card.controller;
        player.moveCard(card, properties.destination, { bottom: !!properties.bottom });
        let target = properties.target;
        if(properties.shuffle && (target.length === 0 || card === target[target.length - 1])) {
            if(properties.destination === Locations.ConflictDeck) {
                card.owner.shuffleConflictDeck();
            } else if(properties.destination === Locations.DynastyDeck) {
                card.owner.shuffleDynastyDeck();
            }
        } else if(properties.faceup) {
            card.facedown = false;
        }
        card.checkForIllegalAttachments();
    }
}
