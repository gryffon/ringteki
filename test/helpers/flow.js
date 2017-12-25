const GameFlowWrapper = require('./gameflowwrapper.js');
const DeckBuilder = require('./deckbuilder.js');
let flow = new GameFlowWrapper();
let deckbuilder = new DeckBuilder();

let game = flow.game;
let player1Object = game.getPlayerByName('player1');
let player2Object = game.getPlayerByName('player2');
let player1 = flow.player1;
let player2 = flow.player2;

let deck1 = deckbuilder.customDeck({
    conflict: ['vengeful-oathkeeper']
}).then(deck => {
    console.log(deck);
    player1.selectDeck(deck);
});
let deck2 = deckbuilder.customDeck({
    conflict: ['vengeful-oathkeeper']
}).then(deck => {
    console.log(deck);
    player2.selectDeck(deck);
});

Promise.all([deck1, deck2]).then(() => {
    flow.startGame();
    flow.selectFirstPlayer(player1);
    flow.selectProvinces();
    flow.keepDynasty();
    flow.keepConflict();
    //Dynasty phase
    flow.firstPlayer.playFromProvinces('adept-of-the-waves');
    player2.playFromProvinces('adept-of-the-waves');
    flow.firstPlayer.playFromProvinces('adept-of-the-waves');
    flow.completeDynasty();
    flow.bidHonor(1,1);
    flow.noMoreActions();
    flow.firstPlayer.initiateConflict('military', ['adept-of-the-waves', 'adept-of-the-waves']);
    player2.assignDefenders(['adept-of-the-waves']);
    /*
    */
});
