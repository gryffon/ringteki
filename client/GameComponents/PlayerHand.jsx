import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import { tryParseJSON } from '../util.js';

class PlayerHand extends React.Component {
    constructor(props) {
        super(props);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {};
    }

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');
        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        let card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        let dragData = tryParseJSON(card);
        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    onMouseOver(card) {
        clearTimeout(this.timeout2);
        this.setState({ mouseOver: true });
    }

    onMouseOut() {
        this.timeout2 = setTimeout(() => {
            this.setState({ currentMouseOver: undefined, mouseOver: false });
        }, 500)
    }

    disableMouseOver(revealWhenHiddenTo) {
        if(this.props.spectating && this.props.showHand) {
            return false;
        }

        if(revealWhenHiddenTo === this.props.username) {
            return false;
        }

        return !this.props.isMe;
    }

    onCardMouseOver(cardIndex, card) {
        this.timeout = setTimeout(() => {
            this.setState({ currentMouseOver: cardIndex, mouseOver: true });
        }, 100);

        if(this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onCardMouseOut(cardIndex, card) {
        clearTimeout(this.timeout);

        if(this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    getCards() {
        let cards = this.props.cards;
        let cardIndex = 0;

        if(!this.props.isMe) {
            cards = _.sortBy(this.props.cards, card => card.revealWhenHiddenTo);
        }

        let hand = _.map(cards, card => {
            let style = {};
            let rotation = ((120 / _.size(cards)) * (cardIndex++ - 1)) - 25;

            let transform = `rotate(${rotation}deg)`;
            if(this.state.currentMouseOver < cardIndex) {
                transform = 'translate(20px) ' + transform + 'translate(20px)';
            }

            style.transform = transform;

            return (<Card key={ card.uuid } card={ card } style={ style } disableMouseOver={ this.disableMouseOver(card.revealWhenHiddenTo) } source='hand'
                onMouseOver={ this.onCardMouseOver.bind(this, cardIndex, card) }
                onMouseOut={ this.onCardMouseOut.bind(this, cardIndex, card) }
                onClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                size={ this.props.cardSize } />);
        });

        return hand;
    }

    render() {
        let className = 'hand';

        if(this.props.cardSize !== 'normal') {
            className += ' ' + this.props.cardSize;
        }

        let style = {};
        if(this.state.mouseOver) {
            style.transform = 'scale(2.5)';
        }

        let cards = this.getCards();

        return (<div>
            <grip>
                <div className={ 'hand-title-bar no-highlight ' } >
                    { 'Hand (' + cards.length + ')' } 
                </div>
            </grip>
            <div className={ className }
                style={ style }
                onDragLeave={ this.onDragLeave }
                onDragOver={ this.onDragOver }
                onDrop={ event => this.onDragDrop(event, 'hand') }
                onMouseOver={ this.onMouseOver }
                onMouseOut={ this.onMouseOut }>
                { cards }
            </div>
        );
    }
}

PlayerHand.displayName = 'PlayerHand';
PlayerHand.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    showHand: PropTypes.bool,
    spectating: PropTypes.bool,
    username: PropTypes.string
};

export default PlayerHand;
