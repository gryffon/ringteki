const _ = require('underscore');
import React from 'react';
import PropTypes from 'prop-types';

class ClockPopup extends React.Component {
    render() {
        return (
            <div className='clock--popup'>
                Timer Settings
                <ul>
                    { this.props.mainTime ? <li>Main Time (Minutes): { this.props.mainTime / 60 }</li> : '' }
                    { this.props.periods ? <li>Number of Byoyomi Periods: { this.props.periods }</li> : '' }
                    { this.props.timePeriod ? <li>Byoyomi Time Period (seconds): { this.props.timePeriod }</li> : '' }
                </ul>
            </div>
        );
    }
}

ClockPopup.displayName = 'ClockPopup';
ClockPopup.propTypes = {
    mainTime: PropTypes.number,
    periods: PropTypes.number,
    timePeriod: PropTypes.number
};

export default ClockPopup;
