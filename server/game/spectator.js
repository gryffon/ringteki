class Spectator {
    constructor(id, user) {
        this.user = user;
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
        this.id = id;
        this.lobbyId = null;

        this.buttons = [];
        this.menuTitle = 'Spectator mode';
    }

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }
}

module.exports = Spectator;
