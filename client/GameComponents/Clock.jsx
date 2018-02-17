import React from 'react';
import PropTypes from 'prop-types';

const formattedSeconds = (sec) => Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2);

class Clock extends React.Component {
    constructor() {
        super();
        this.state = { secondsLeft: this.props.secondsLeft };        
    }
/*
    componentDidMount() {
        this.incrementer = setInterval(() => increment(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.incrementer);
    }

    increment() {
        if(this.props.active) {
            this.setState({ secondsLeft: this.state.secondsLeft - 1 });
        }
    }
*/
    render() {
        return (
            <div className={ 'hand-size' }>
                { formattedSeconds(this.state.secondsLeft) }
            </div>
        );
    }
}

Clock.displayName = 'Clock';
Clock.propTypes = {
    active: PropTypes.bool,
    secondsLeft: PropTypes.int
};

export default Clock;