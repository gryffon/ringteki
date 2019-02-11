import React from 'react';
import PropTypes from 'prop-types';

const formattedSeconds = (sec) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

class Clock extends React.Component {
    constructor() {
        super();

        this.state = { timeLeft: 0 };
    }

    componentWillReceiveProps(newProps) {
        if(newProps.secondsLeft === 0 || this.stateId === newProps.stateId) {
            return;
        }
        this.stateId = newProps.stateId;
        this.setState({ timeLeft: newProps.secondsLeft });

        if(this.timerHandle) {
            clearInterval(this.timerHandle);
        }

        if(newProps.mode !== 'stop') {
            this.timerHandle = setInterval(() => {
                this.setState({
                    timeLeft: this.state.timeLeft + (newProps.mode === 'up' ? 1 : -1)
                });
            }, 1000);
        }

    }

    render() {
        let className = 'player-stats-row state clock';
        if(this.props.mode !== 'stop') {
            className += ' clock-active';
        }
        return (
            <div className={ className }>
                <span>
                    <img src='/img/free-clock-icon-png.png' className='clock-icon' />
                </span>
                { formattedSeconds(this.state.timeLeft) }
            </div>
        );
    }
}

Clock.displayName = 'Clock';
Clock.propTypes = {
    mode: PropTypes.string,
    secondsLeft: PropTypes.number,
    stateId: PropTypes.number
};

export default Clock;
