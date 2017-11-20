import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeHand, playCardsFromHand } from '../../ReduxActions/hand';
import SelectHand from './SelectHand.jsx';

class ConflictHand extends React.PureComponent {
    onExit = this.props.closeHand;
    onSubmit = (selectedCards) => selectedCards.forEach(
        card => this.props.gameSelectCard(card.uuid)
    );

    render() {
        return (
            <SelectHand
                onExit = { this.onExit }
                onSubmit = { this.onSubmit }
                { ...this.props }
            />
        );
    }
}

ConflictHand.propTypes = {
    canSubmit: PropTypes.func,
    cards: PropTypes.array,
    closeHand: PropTypes.func,
    gameSelectCard: PropTypes.func,
    open: PropTypes.bool,
    playCardsFromHand: PropTypes.func
};

function mapStateToProps(state) {
    const {
        hand: {open},
        socket: {gameSocket},
        auth: {username},
        games: {currentGame}
    } = state;

    const player = currentGame.players[username];
    const {cardPiles: {hand: cards}, selectCard, selectNum} = player;
    const sendGameMessage = (message, ...args) => gameSocket.emit('game', message, ...args);
    const gameSelectCard = sendGameMessage.bind(null, 'cardClicked');

    const canSubmit = (selected) => selectCard
        ? selectNum === 0 || selectNum === selected.length
        : selected.length === 1;

    return {
        cards,
        canSubmit,
        gameSelectCard,
        open
    };
}

const mapDispatchToProps = {
    closeHand,
    playCardsFromHand
};

export default connect(mapStateToProps, mapDispatchToProps)(ConflictHand);
