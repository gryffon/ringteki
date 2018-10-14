class PlayableLocation {
    constructor(playingType, player, location, cards = []) {
        this.playingType = playingType;
        this.player = player;
        this.location = location;
        this.cards = cards;
    }

    contains(card) {
        if(this.cards.length > 0 && !this.cards.includes(card)) {
            return false;
        }
        var pile = this.player.getSourceList(this.location);
        return pile.contains(card);
    }
}

module.exports = PlayableLocation;
