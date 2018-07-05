import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import {tryParseJSON} from '../util.js';

class Province extends React.Component {
    constructor() {
        super();

        this.onDragDrop = this.onDragDrop.bind(this);

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

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    render() {
        var className = 'panel province ' + this.props.size;
        var cardCount = this.props.cardCount || (this.props.cards ? this.props.cards.length : '0');
        var headerText = this.props.title ? this.props.title + ' (' + (cardCount) + ')' : '';
        var provinceCard = this.props.provinceCard || _.find(this.props.cards, card => {
            return card.isProvince;
        });
        var dynastyCards = this.props.dynastyCard || _.filter(this.props.cards, card => {
            return card.isDynasty;
        });
        var strongholdCard = this.props.strongholdCard || _.find(this.props.cards, card => {
            return card.isStronghold;
        });

        if(this.props.hiddenProvinceCard && provinceCard) {
            provinceCard.facedown = true;
        }

        if(this.props.hiddenDynastyCard && dynastyCards.length > 0) {
            for(var i = 0; i < dynastyCards.length; i++) {
                dynastyCards[i].facedown = true;
            }
        }

        let cardClassName = '';
        if(provinceCard) {
            cardClassName = 'province-attachment';
        }

        if(this.props.size !== 'normal') {
            cardClassName += ' ' + this.props.size;
        }


        if(this.props.orientation === 'horizontal' || this.props.orientation === 'bowed') {
            className += ' horizontal';
        } else {
            className += ' vertical';
        }

        return (
            <div className={ className } onDragLeave={ this.onDragLeave } onDragOver={ this.onDragOver } onDrop={ event => this.onDragDrop(event, this.props.source) }
                onClick={ this.onCollectionClick }>
                <div className='panel-header'>
                    { headerText }
                </div>
                { provinceCard ? <Card card={ provinceCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ provinceCard.facedown && !this.props.isMe }
                    onClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop } size={ this.props.size } /> : null }
                { dynastyCards.length > 0 ? _.map(dynastyCards, card => {
                    return (<Card className={ cardClassName } card={ card } source={ this.props.source }
                        popupLocation={ this.props.popupLocation }
                        isMe={ this.props.isMe }
                        key={ card.uuid }
                        onMouseOver={ this.props.onMouseOver }
                        onMouseOut={ this.props.onMouseOut }
                        disableMouseOver={ card.facedown && !card.id }
                        onClick={ this.props.onCardClick }
                        onMenuItemClick={ this.props.onMenuItemClick }
                        onDragDrop={ this.props.onDragDrop } size={ this.props.size } />);
                }) : null }
                { strongholdCard ? <Card className={ cardClassName } card={ strongholdCard } source={ this.props.source }
                    onMouseOver={ this.props.onMouseOver }
                    onMouseOut={ this.props.onMouseOut }
                    disableMouseOver={ strongholdCard.facedown }
                    onClick={ this.props.onCardClick }
                    onMenuItemClick={ this.props.onMenuItemClick }
                    onDragDrop={ this.props.onDragDrop } size={ this.props.size } /> : null }
            </div>);
    }
}

Province.displayName = 'Province';
Province.propTypes = {
    cardCount: PropTypes.number,
    cards: PropTypes.array,
    disableMouseOver: PropTypes.bool,
    dynastyCard: PropTypes.object,
    hiddenDynastyCard: PropTypes.bool,
    hiddenProvinceCard: PropTypes.bool,
    isBroken: PropTypes.bool,
    isMe: PropTypes.bool,
    menu: PropTypes.array,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTouchMove: PropTypes.func,
    orientation: PropTypes.string,
    popupLocation: PropTypes.string,
    popupMenu: PropTypes.array,
    provinceCard: PropTypes.object,
    showDynastyRow: PropTypes.bool,
    size: PropTypes.string,
    source: PropTypes.oneOf(['stronghold province', 'province 1', 'province 2', 'province 3', 'province 4']).isRequired,
    strongholdCard: PropTypes.object,
    title: PropTypes.string
};
Province.defaultProps = {
    orientation: 'vertical'
};

export default Province;
