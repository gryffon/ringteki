import BaseAbility = require('./baseability.js');
import EffectSource = require('./EffectSource.js');
import Game = require('./game');
import Player = require('./player');
import Ring = require('./ring');
import { Stages, Locations } from './Constants.js';

interface AbilityContextProperties {
    game: Game;
    source?: any;
    player?: Player;
    ability?: BaseAbility;
    costs?: any;
    targets?: any;
    rings?: any;
    selects?: any;
    events?: any[];
    stage?: Stages;
    targetAbility?: any;
}

class AbilityContext {
    game: Game;
    source: any;
    player: Player;
    ability: BaseAbility;
    costs: any;
    targets: any;
    rings: any;
    selects: any;
    events: any[] = [];
    stage: Stages;
    targetAbility: any;
    target: any;
    select: string;
    ring: Ring;
    provincesToRefill: any[] = [];
    secondResolution = false;
    constructor(properties: AbilityContextProperties) {
        this.game = properties.game;
        this.source = properties.source || new EffectSource(this.game);
        this.player = properties.player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = properties.costs || {};
        this.targets = properties.targets || {};
        this.rings = properties.rings || {};
        this.selects = properties.selects || {};
        this.stage = properties.stage || Stages.Effect;
        this.targetAbility = properties.targetAbility;
    }

    copy(newProps: object): AbilityContext {
        let copy = new AbilityContext(Object.assign(this.getProps(), newProps));
        copy.target = this.target;
        copy.select = this.select;
        copy.ring = this.ring;
        copy.provincesToRefill = this.provincesToRefill;
        copy.secondResolution = this.secondResolution;
        return copy;
    }

    refillProvince(player: Player, location: Locations): void {
        this.provincesToRefill.push({ player, location });
    }

    refill(): void {
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            for(let refill of this.provincesToRefill.filter(refill => refill.player === player)) {
                this.game.queueSimpleStep(() => {
                    player.replaceDynastyCard(refill.location);
                    return true;
                });
            }
        }
    }

    getProps(): AbilityContextProperties {
        return {
            game: this.game,
            source: this.source,
            player: this.player,
            ability: this.ability,
            costs: Object.assign({}, this.costs),
            targets: Object.assign({}, this.targets),
            rings: Object.assign({}, this.rings),
            selects: Object.assign({}, this.selects),
            events: this.events,
            stage: this.stage,
            targetAbility: this.targetAbility
        };
    }
}

export = AbilityContext;
