import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { closeHand, playCardsFromHand } from '../../ReduxActions/hand';

import ConflictCard from './ConflictCard.jsx';
import CircleButton from './CircleButton.jsx';
import Overlay from './Overlay.jsx';

const cardWidth = 300;
const cardHeight = 420;
const maxWidth = 100;
const maxHeight = 15;
const maxRadial = 15;
const maxRotate = 50;
const maxTranslateX = window.innerWidth - cardWidth * 2;
const maxTranslateY = 200;

const StyledHand = styled.div`
    position: fixed;
    z-index: 100000;
    top: 0;
    left: 0;
`;

const StyledCards = styled.div`
    display: flex;
    justify-content: center;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 100;
    padding: 10% 0;
`;

const StyledCloseButtonContainer = styled.div`
    margin-top: 5%;
    margin-left: 5%;
    position: fixed;
    z-index: 101;
`;

class ConflictHand extends React.PureComponent {
    state = {
        selected: [],
        hovered: undefined,
        exiting: false
    };
    initialState = this.state;

    baseTranslateX = Math.min(maxTranslateX / this.props.cards.length, maxWidth);
    baseTranslateY = Math.min(maxTranslateY / this.props.cards.length, maxHeight);
    baseRotate = Math.min(maxRotate / this.props.cards.length, maxRadial);
    openDuration = .5;
    exitDuration = .4;

    calculateShadow(rotate) {
        let percentage = Math.abs(rotate) / maxRotate;
        let bottomShadow = rotate < 0
            ? -1 * percentage * cardWidth
            : (1 - percentage) * cardWidth / -4;
        
        return `-3px 0px 6px 0px #2B2B2B, ${bottomShadow}px ${-1 * bottomShadow + 1}px 6px ${bottomShadow}px #2B2B2B`;
    }
    
    sendCards = () => {
        const { cards, playCardsFromHand, gameSelectCard } = this.props;
        const selectedCards = this.state.selected.map(i => cards[i]);
        
        selectedCards.forEach(c => gameSelectCard(c.uuid));
        playCardsFromHand(selectedCards);
        this.setState(this.initialState);
    }

    playCards = () => this.exit(this.sendCards);

    exitHand = () => {
        this.exit(() => {
            this.props.closeHand();
            this.setState(this.initialState);
        });
    }
    
    exit = (cb) => {        
        this.setState(
            { exiting: true },
            () => window.setTimeout(cb, this.exitDuration * 1000)
        );
    }

    select = (i) => {
        const selected = this.state.selected;
        this.setState({ selected: [...selected, i] });
    }

    unselect = (i) => {
        let selected = this.state.selected;
        let index = selected.indexOf(i);

        selected = [
            ...selected.slice(0, index),
            ...selected.slice(index + 1)
        ];
        this.setState({ selected });
    }

    moveOut = () => {
        this.timer = window.setTimeout(
            () => this.setState({ hovered: undefined }),
            250
        );
    }

    moveIn = (i) => {
        window.clearTimeout(this.timer)
        this.setState({ hovered: i })
    }

    render = () => {
        const { selected, hovered, exiting } = this.state;
        const { cards, selectNum, selectCard } = this.props;
        const cardsCenter = cards.length / 2 - .5;
        const correctAmountSelected = selectCard 
            ? selectNum === 0 || selectNum === selected.length
            : selected.length === 1;

        console.log(selectCard, selectNum, selected.length);
        if(this.props.open) {
            return (
                <StyledHand>
                    <StyledCloseButtonContainer>
                        <CircleButton
                            size = { 80 }
                            border = { 4 }
                            onClick = { this.exitHand }
                            content = 'x'
                            turn
                        />
                        {
                            correctAmountSelected &&
                            <CircleButton
                                size = { 80 }
                                border = { 4 }
                                onClick = { this.playCards }
                                content = 'check'
                                tertiary = 'rgba(0,128,0,0.85)'
                            />
                        }
                    </StyledCloseButtonContainer>
                    <StyledCards className = 'conflict-hand-cards'>
                        {
                            cards.map((card, i) => {
                                const seperation = i - cardsCenter;
                                const translateY = Math.abs(this.baseTranslateY * seperation);
                                const rotate = this.baseRotate * seperation;
                                const shadow = this.calculateShadow(rotate);
                                
                                let translateX = this.baseTranslateX * seperation;
                                if(i > hovered) {
                                    translateX = translateX + cardWidth;
                                }

                                return (
                                    <ConflictCard
                                        cardId = { card.id }
                                        key = { card.uuid }
                                        selectable = { card.selectable }
                                        index = { i }
                                        translateX = { translateX }
                                        translateY = { translateY }
                                        rotate = { rotate }
                                        selected = { selected.indexOf(i) !== -1 }
                                        shadow = { i === 0 || hovered + 1 === i ? '' : shadow }
                                        exiting = { exiting }
                                        openDuration = { this.openDuration }
                                        exitDuration = { this.exitDuration }
                                        onMouseOut = { this.moveOut }
                                        onMouseEnter = { () => !exiting && this.moveIn(i) }
                                        onClick = { this.select.bind(this, i) }
                                        onSelectClick = { this.unselect.bind(this, i) }
                                    />
                                );
                            })
                        }
                    </StyledCards>
                    <Overlay />
                </StyledHand>
            );
        }

        return null;
    }
}

ConflictHand.propTypes = {
    cards: PropTypes.array,
    closeHand: PropTypes.func,
    open: PropTypes.bool,
    playCardsFromHand: PropTypes.func
};

function mapStateToProps(state, props) {
    const {
        hand,
        socket: {gameSocket},
        auth: {username},
        games: {currentGame}
    } = state;

    const player = currentGame.players[username];
    const {cardPiles: {hand: cards}, selectCard, selectNum} = player;
    const sendGameMessage = (message, ...args) => gameSocket.emit('game', message, ...args);
    
    console.log(player)
    console.log(cards)

    return {
        cards,
        open: hand.open,
        selectCard: selectCard,
        selectNum: selectNum,
        gameSelectCard: sendGameMessage.bind(null, 'cardClicked'),
        ...props
    };
}

const mapDispatchToProps = {
    closeHand,
    playCardsFromHand
};

export default connect(mapStateToProps, mapDispatchToProps)(ConflictHand);
