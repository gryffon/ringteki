import React from 'react';
import PropTypes from 'prop-types';

const formattedSeconds = (sec) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

class Clock extends React.Component {
    constructor() {
        super();

        this.state = { timeLeft: 0 };
    }

    shouldComponentUpdate(newProps, newState) {
        return newProps.active !== this.props.active || newProps.secondsLeft !== this.props.secondsLeft;
    }

    componentWillUpdate(newProps, newState) {
        if(newProps.secondsLeft === 0) {
            return;
        }

        if(newProps.active) {
            if(newState.timerHandle) {
                return;
            }

            let handle = setInterval(() => {
                this.setState({
                    timeLeft: this.state.timeLeft - 1
                });
            }, 1000);

            this.setState({ timerHandle: handle, timeLeft: newProps.secondsLeft });
        } else if(newState.timerHandle) {
            clearInterval(newState.timerHandle);
            this.setState({ timerHandle: null, timeLeft: newProps.secondsLeft });
        }

    }

    render() {
        return (
            <div className={ 'hand-size' }>
                { formattedSeconds(this.state.timeLeft) }
            </div>
        );
    }
}

Clock.displayName = 'Clock';
Clock.propTypes = {
    active: PropTypes.bool,
    secondsLeft: PropTypes.number,
};

export default Clock;