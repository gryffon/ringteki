class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
        this.id = id;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }

    getShortSummary() {
        return {
            name: this.name,
            id: this.id,
            type: 'spectator'
        };
    }
}

module.exports = Spectator;
