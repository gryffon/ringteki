import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SelectHandCard from './SelectHandCard.jsx';
import CircleButton from './CircleButton.jsx';
import Overlay from './Overlay.jsx';

const StyledCards = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const StyledCloseButtonContainer = styled.div`
    margin-top: 5%;
    margin-left: 5%;
    position: fixed;
    z-index: 2;
`;

class SelectHand extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            hovered: undefined,
            exiting: false
        };
        this.initialState = this.state;
        this.maxRotate = 40;
        this.maxDisplacementX = 100;
        this.maxDisplacementY = 15;
        this.maxRadial = 15;
        this.openDuration = .5;
        this.exitDuration = .4;

        this.resize = this.resize.bind(this);
        this.playCards = this.playCards.bind(this);
        this.exitHand = this.exitHand.bind(this);
        this.exit = this.exit.bind(this);
        this.select = this.select.bind(this);
        this.unselect = this.unselect.bind(this);
        this.moveOut = this.moveOut.bind(this);
        this.moveIn = this.moveIn.bind(this);
    }

    componentWillMount() {
        this.resize();
    }

    componentWillReceiveProps() {   
        this.resize();  
    }
    
    resize() {
        this.cardHeight = Math.min(420, window.innerHeight * .95);
        this.cardWidth = this.cardHeight * 30 / 42;
        this.maxTranslateX = window.innerWidth - this.cardWidth * 2;
        this.maxTranslateY = 200;
    
        this.baseTranslateX = Math.min(
            this.maxTranslateX / this.props.cards.length,
            this.maxDisplacementX
        );
        this.baseTranslateY = Math.min(
            this.maxTranslateY / this.props.cards.length,
            this.maxDisplacementY
        );
        this.baseRotate = Math.min(
            this.maxRotate / this.props.cards.length,
            this.maxRadial
        );
    }

    playCards() {
        this.exit(this.props.onSubmit);
    }

    exitHand() {
        this.exit(this.props.onExit);
    }
    
    exit(cb) {
        const { cards } = this.props;
        const selectedCards = this.state.selected.map(i => cards[i]);

        let afterExit = () => {
            cb && cb(selectedCards);
            this.setState(this.initialState);
        };
        
        this.setState(
            { exiting: true },
            () => window.setTimeout(afterExit, this.exitDuration * 1000)
        );
    }

    select(i) {
        const selected = this.state.selected;
        const { cards, onSelect } = this.props;
        onSelect(cards[i]);
        this.setState({ selected: [...selected, i] });
    }

    unselect(i) {
        let selected = this.state.selected;
        const { cards, onUnselect } = this.props;
        const index = selected.indexOf(i);

        onUnselect(cards[i]);
        selected = [
            ...selected.slice(0, index),
            ...selected.slice(index + 1)
        ];
        this.setState({ selected });
    }

    moveOut() {
        this.timer = window.setTimeout(
            () => this.setState({ hovered: undefined }),
            250
        );
    }

    moveIn(i) {
        window.clearTimeout(this.timer);
        this.setState({ hovered: i });
    }

    render() {
        const { selected, hovered, exiting } = this.state;
        const { cards, canSubmit, mustSubmit, open } = this.props;
        const cardsCenter = cards.length / 2 - .5;

        if(open) {
            return (
                <Overlay>
                    <StyledCloseButtonContainer>
                        {
                            ! mustSubmit &&
                            <CircleButton
                                size = { 80 }
                                border = { 4 }
                                onClick = { this.exitHand }
                                turn
                            >
                                { '\u2715' }
                            </CircleButton>
                        }
                        {
                            canSubmit && canSubmit(selected, cards) &&
                            <CircleButton
                                size = { 80 }
                                border = { 4 }
                                onClick = { this.playCards }
                                content = 'check'
                                tertiary = 'rgba(0,128,0,0.85)'
                            >
                                { '\u2713' }
                            </CircleButton>
                        }
                    </StyledCloseButtonContainer>
                    <StyledCards className = 'conflict-hand-cards'>
                        {
                            cards.map((card, i) => {
                                const seperation = i - cardsCenter;
                                const rotate = this.baseRotate * seperation;
                                const percentage = Math.abs(rotate) / this.maxRotate;
                                const translateY = (
                                    Math.abs(seperation) - (cardsCenter / 2)
                                ) * this.baseTranslateY;
                                const translateX = i > hovered
                                    ? this.baseTranslateX * (seperation - .5) + this.cardWidth
                                    : this.baseTranslateX * seperation;

                                return (
                                    <SelectHandCard
                                        key = { card.uuid }
                                        cardId = { card.id }
                                        durationOpen = { this.openDuration }
                                        durationExit = { this.exitDuration }
                                        exiting = { exiting }
                                        height = { this.cardHeight }
                                        index = { i }
                                        onClick = { this.select.bind(this, i) }
                                        onMouseEnter = { () => !exiting && this.moveIn(i) }
                                        onMouseOut = { this.moveOut }
                                        onSelectClick = { this.unselect.bind(this, i) }
                                        percentage = { percentage }
                                        rotate = { rotate }
                                        selectable = { card.selectable }
                                        selected = { selected.indexOf(i) !== -1 }
                                        showShadow = { i !== 0 && i !== hovered + 1 }
                                        translateX = { translateX }
                                        translateY = { translateY }
                                        width = { this.cardWidth }
                                    />
                                );
                            })
                        }
                    </StyledCards>
                </Overlay>
            );
        }

        return null;
    }
}

SelectHand.propTypes = {
    canSubmit: PropTypes.func,
    cards: PropTypes.array,
    mustSubmit: PropTypes.bool,
    onExit: PropTypes.func,
    onSelect: PropTypes.func,
    onSubmit: PropTypes.func,
    onUnselect: PropTypes.func,
    open: PropTypes.bool
};

export default SelectHand;
