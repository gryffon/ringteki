import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from './Card.jsx';

class SquishableCardPanel extends React.Component {
    disableMouseOver(revealWhenHiddenTo) {
        if(this.props.spectating && this.props.showHand) {
            return false;
        }

        if(revealWhenHiddenTo === this.props.username) {
            return false;
        }

        return !this.props.isMe;
    }

    getCards(needsSquish) {
        let overallDimensions = this.getOverallDimensions();
        let dimensions = this.getCardDimensions();

        let cards = this.props.cards;
        let cardIndex = 0;
        let handLength = cards ? cards.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);

        if(!this.props.isMe) {
            cards = [...this.props.cards].sort((a, b) => a.revealWhenHiddenTo - b.revealWhenHiddenTo);
        }

        let hand = cards.map(card => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={ card.uuid }
                card={ card }
                disableMouseOver={ this.disableMouseOver(card.revealWhenHiddenTo) }
                onClick={ this.props.onCardClick }
                onMouseOver={ this.props.onMouseOver }
                onMouseOut={ this.props.onMouseOut }
                size={ this.props.cardSize }
                style={ style }
                source={ this.props.source } />);
        });

        return hand;
    }

    getCardDimensions() {
        let multiplier = this.getCardSizeMultiplier();
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }

    getCardSizeMultiplier() {
        switch(this.props.cardSize) {
            case 'small':
                return 0.8;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
        }

        return 1;
    }

    getOverallDimensions() {
        let cardDimensions = this.getCardDimensions();
        return {
            width: (cardDimensions.width + 5) * this.props.maxCards,
            height: cardDimensions.height
        };
    }

    render() {
        let dimensions = this.getOverallDimensions();
        let maxCards = this.props.maxCards;
        let needsSquish = this.props.cards && this.props.cards.length > maxCards;
        let cards = this.getCards(needsSquish, maxCards);

        let className = classNames('squishable-card-panel', this.props.className, {
            [this.props.cardSize]: this.props.cardSize !== 'normal',
            'squish': needsSquish
        });

        let style = {
            width: dimensions.width + 'px',
            height: dimensions.height + 'px'
        };

        return (
            <div className={ className } style={ style }>
                { this.props.title &&
                    <div className='panel-header'>
                        { `${this.props.title} (${cards.length})` }
                    </div>
                }
                { cards }
            </div>
        );
    }
}

SquishableCardPanel.displayName = 'SquishableCardPanel';
SquishableCardPanel.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.array,
    className: PropTypes.string,
    isMe: PropTypes.bool,
    maxCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    showHand: PropTypes.bool,
    source: PropTypes.string,
    spectating: PropTypes.bool,
    title: PropTypes.string,
    username: PropTypes.string
};

export default SquishableCardPanel;
