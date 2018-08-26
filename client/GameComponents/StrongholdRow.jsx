import React from 'react';
import PropTypes from 'prop-types';

import Province from './Province.jsx';
import Placeholder from './Placeholder.jsx';
import CardPile from './CardPile.jsx';

class StrongholdRow extends React.Component {

    getFavor(player) {
        return (
            <div className={ `card-wrapper imperial-favor vertical ${this.props.cardSize} ${ player && player.imperialFavor ? '' : 'hidden'}` }>
                {
                    player &&
                    <img
                        className={ `card-image imperial-favor ${ this.props.cardSize } ${player.imperialFavor ? '' : 'hidden'} ` }
                        src={ '/img/' + (player.imperialFavor ? player.imperialFavor : 'political') + '-favor.png' }
                    />
                }
            </div>
        );
    }

    render() {

        if(this.props.isMe || this.props.spectating && !this.props.otherPlayer) {
            let shClass = 'player-stronghold-row our-side';
            if(this.props.thisPlayer && this.props.thisPlayer.favor) {
                shClass += ' favor';
            }
            return (
                <div className={ shClass }>
                    { this.props.thisPlayer && this.props.thisPlayer.role && this.props.thisPlayer.role.location ? <CardPile className='rolecard' source='role card' cards={ [this.props.thisPlayer.role] } topCard={ this.props.thisPlayer.role } disableMenu
                        onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } /> : <Placeholder size={ this.props.cardSize } /> }
                    <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onDragDrop={ this.props.onDragDrop } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } onMenuItemClick={ this.props.onMenuItemClick } />
                    { this.getFavor(this.props.thisPlayer) }
                </div>
            );
        }
        let shClass = 'player-stronghold-row their-side';
        if(this.props.otherPlayer && this.props.otherPlayer.favor) {
            shClass += ' favor';
        }
        return (
            <div className={ shClass }>
                { this.getFavor(this.props.otherPlayer) }
                <Province isMe={ this.props.isMe } source='stronghold province' cards={ this.props.strongholdProvinceCards } onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } />
                { this.props.otherPlayer && this.props.otherPlayer.role && this.props.otherPlayer.role.location ? <CardPile className='rolecard' source='role card' cards={ [this.props.otherPlayer.role] } topCard={ this.props.otherPlayer.role } disableMenu
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onCardClick={ this.props.onCardClick } size={ this.props.cardSize } /> : <Placeholder size={ this.props.cardSize } /> }
            </div>
        );

    }
}

StrongholdRow.displayName = 'StrongholdRow';
StrongholdRow.propTypes = {
    cardSize: PropTypes.string,
    isMe: PropTypes.bool,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    otherPlayer: PropTypes.object,
    role: PropTypes.object,
    spectating: PropTypes.bool,
    strongholdProvinceCards: PropTypes.array,
    thisPlayer: PropTypes.object
};

export default StrongholdRow;
