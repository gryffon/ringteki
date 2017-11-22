import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeHand, playCardsFromHand } from '../../ReduxActions/hand';
import SelectHand from './SelectHand.jsx';

class ConflictHand extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onExit = this.onExit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
        this.onSelect = this.cardClicked;
        this.onUnselect = this.cardClicked;
    }

    onExit(selectedCards) {
        this.props.closeHand();

        if(! this.props.selectAutomatic) {
            selectedCards.forEach(card => this.props.gameSelectCard(card.uuid));
        }
    }

    onSubmit(selectedCards) {
        this.props.playCardsFromHand(selectedCards);
        if(this.props.selectAutomatic) {
            selectedCards.forEach(card => this.props.gameSelectCard(card.uuid));
        }

        this.props.gameStepDone();
    }

    cardClicked(card) {
        if(! this.props.selectAutomatic) {
            this.props.gameSelectCard(card.uuid);
        }
    }

    render() {
        return (
            <SelectHand
                canSubmit = { this.props.canSubmit }
                cards = { this.props.cards }
                onExit = { this.onExit }
                onSelect = { this.onSelect }
                onSubmit = { this.onSubmit }
                onUnselect = { this.onUnselect }
                open = { this.props.open }
            />
        );
    }
}

ConflictHand.propTypes = {
    canSubmit: PropTypes.func,
    cards: PropTypes.array,
    closeHand: PropTypes.func,
    gameSelectCard: PropTypes.func,
    gameStepDone: PropTypes.func,
    open: PropTypes.bool,
    playCardsFromHand: PropTypes.func,
    selectAutomatic: PropTypes.bool
};

function mapStateToProps(state) {
    const {
        hand: {open},
        socket: {gameSocket},
        auth: {username},
        games: {currentGame}
    } = state;

    const player = currentGame.players[username];
    const {cardPiles: {hand: cards}, selectMode, selectAutomatic, buttons} = player;
    const sendGameMessage = (message, ...args) => gameSocket.emit('game', message, ...args);
    const gameSelectCard = sendGameMessage.bind(null, 'cardClicked');
    const doneButton = ! selectAutomatic && buttons.find(b => b.arg === 'done');
    const gameStepDone = doneButton
        ? sendGameMessage.bind(null, 'menuButton', doneButton.arg, doneButton.uuid)
        : () => {};

    let canSubmit;
    switch(selectMode) {
        case 'unlimited':
            canSubmit = () => true;
            break;
        case 'maxStat':
        case 'upTo':
            canSubmit = (selected) => selected.length > 0;
            break;
        case 'single':
        default:
            canSubmit = (selected) => selected.length === 1;
            break;
    }

    return {
        cards,
        canSubmit,
        gameSelectCard,
        gameStepDone,
        open,
        selectAutomatic
    };
}

const mapDispatchToProps = {
    closeHand,
    playCardsFromHand
};

export default connect(mapStateToProps, mapDispatchToProps)(ConflictHand);
