const GameFlowWrapper = require('./gameflowwrapper.js');
const DeckBuilder = require('./deckbuilder.js');
const deckBuilder = new DeckBuilder();

let options = {
    phase: 'regroup',
    player1: {
        faction: 'dragon',
        fate: 10,
        honor: 15,
        stronghold: 'City of the Open Hand',
        provinces: {
            'province 1': {
                provinceCard: 'Blood of Onnotangu',
                dynastyCards: ['Ascetic Visionary']
            },
            'province 2': {
                dynastyCard: ['Moto Horde']
            }
        },
        inPlay: [
            'Adept of the Waves',
            {
                card: 'Fearsome Mystic',
                fate: 10,
                honored: true,
                bowed: true,
                attachments: ['Ornate Fan', 'fine-katana']
            }
        ],
        hand: [
            'Banzai!',
            'Supernatural Storm'
        ],
        conflictDeck: [
            'yogo-kikuyo'
        ],
        conflictDiscard: [
            'Backhanded Compliment'
        ],
        dynastyDeck: [
            'Aggressive Moto'
        ],
        dynastyDiscard: [
            'Back-Alley Hideaway'
        ]
    },
    player2 : {
        role: 'Seeker of Fire',
        faction: 'crab',
        stronghold: 'Golden Plains Outpost',
        strongholdProvince: 'along-the-river-of-gold',
        inPlay: [
            'Aggressive Moto',
            'bayushi-liar'
        ]
    }
};

// GameFlowWrapper.setupTest(settings)
//     .then(res => {
//         game = res;
//     });


var game = new GameFlowWrapper();
var player1 = game.player1;
var player2 = game.player2;

//Set defaults
if(!options.player1) {
    options.player1 = {};
}
if(!options.player2) {
    options.player2 = {};
}

//Build decks (somehow)
var deck1 = deckBuilder.customDeck(options.player1)
    .then(deck => player1.selectDeck(deck));
var deck2 = deckBuilder.customDeck(options.player2)
    .then(deck => player2.selectDeck(deck));
Promise.all([deck1, deck2])
.then(() => {
    game.startGame();
    //Setup phase
    game.selectFirstPlayer(player1);
    game.selectStrongholdProvinces({
        player1: options.player1.strongholdProvince || deckBuilder.fillers.province,
        player2: options.player2.strongholdProvince || deckBuilder.fillers.province
    });
    game.keepDynasty();
    game.keepConflict();

    //Advance the phases to the specified
    game.advancePhases(options.phase);

    ///Set state
    player1.fate = options.player1.fate;
    player2.fate = options.player2.fate;
    player1.honor = options.player1.honor;
    player2.honor = options.player2.honor;
    player1.inPlay = options.player1.inPlay;
    player2.inPlay = options.player2.inPlay;
    player1.hand = options.player1.hand;
    player2.hand = options.player2.hand;
    player1.provinces = options.player1.provinces;
    player2.provinces = options.player2.provinces;
    player1.dynastyDiscardPile = options.player1.dynastyDiscard;
    player2.dynastyDiscardPile = options.player2.dynastyDiscard;
    player1.conflictDiscardPile = options.player1.conflictDiscard;
    player2.conflictDiscardPile = options.player2.conflictDiscard;
});
