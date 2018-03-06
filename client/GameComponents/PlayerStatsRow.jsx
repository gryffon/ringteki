import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../Avatar.jsx';
import Clock from './Clock.jsx';

export class PlayerStatsRow extends React.Component {
    constructor() {
        super();

        this.sendUpdate = this.sendUpdate.bind(this);
    }

    sendUpdate(type, direction) {
        this.props.sendGameMessage('changeStat', type, direction === 'up' ? 1 : -1);
    }

    getStatValueOrDefault(stat) {
        if(!this.props.stats) {
            return 0;
        }

        return this.props.stats[stat] || 0;
    }

    getButton(stat, name, statToSet = stat) {
        const imageStyle = { backgroundImage: `url(/img/${name}.png)` };

        return (
            <div className='state'>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'down') }>
                        <img src='/img/Minus.png' title='-' alt='-' />
                    </button>
                }
                <div className='stat-image' style={ imageStyle }>
                    <div className='stat-value'>{ this.getStatValueOrDefault(stat) }</div>
                </div>
                {
                    this.props.showControls &&
                    <button className='btn btn-stat' onClick={ this.sendUpdate.bind(this, statToSet, 'up') }>
                        <img src='/img/Plus.png' title='+' alt='+' />
                    </button>
                }
            </div>
        );
    }

    render() {
        let playerAvatar = (
            <div className='player-avatar state'>
                <Avatar emailHash={ this.props.user ? this.props.user.emailHash : 'unknown' } />
                <b>{ this.props.user ? this.props.user.username : 'Noone' }</b>
            </div>);

        let secondsLeft = this.getStatValueOrDefault('chessClockLeft');
        let chessClock = (<Clock secondsLeft={ secondsLeft } active={ this.getStatValueOrDefault('chessClockActive') } />);
        return (
            <div className='panel player-stats'>
                { playerAvatar }
                { this.getButton('fate', 'Fate') }
                { this.getButton('honor', 'Honor') }
                {
                    this.props.firstPlayer &&
                    <div className='state first-player-state'>
                        <img className='first-player-indicator' src='/img/first-player.png' title='First Player' />
                    </div>
                }
                {
                    (this.props.otherPlayer || this.props.spectating) &&
                    <div className='state'>
                        <div className='hand-size'>Hand Size: { this.props.handSize }</div>
                    </div>
                }
                <div className='state'>
                    <div className='conflicts-remaining'>
                        Conflicts Remaining: { this.getStatValueOrDefault('conflictsRemaining') }
                        { this.getStatValueOrDefault('politicalRemaining') ? <span className='icon-political'/> : null }
                        { this.getStatValueOrDefault('militaryRemaining') ? <span className='icon-military'/> : null }
                    </div>
                </div>
                { secondsLeft > 0 && chessClock }
            </div>
        );
    }
}

PlayerStatsRow.displayName = 'PlayerStatsRow';
PlayerStatsRow.propTypes = {
    firstPlayer: PropTypes.bool,
    handSize: PropTypes.number,
    otherPlayer: PropTypes.bool,
    sendGameMessage: PropTypes.func,
    showControls: PropTypes.bool,
    spectating: PropTypes.bool,
    stats: PropTypes.object,
    user: PropTypes.object
};

export default PlayerStatsRow;
