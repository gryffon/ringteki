import React from 'react';
import PropTypes from 'prop-types';

import Counter from './Counter.jsx';

class AbilityCounter extends Counter {
    render() {
        var className = 'abilitycounter ' + this.props.name;

        if(this.props.cancel) {
            className += ' cancel';
        }

        if(this.props.fade) {
            className += ' fade-out';
        }

        if(this.props.value === 2) {
            className += ' used';
        }
        
        return (<div key={ this.props.name } className={ className }>
            <span className='glyphicon glyphicon-record' />
        </div>);
    }
}

AbilityCounter.displayName = 'AbilityCounter';
AbilityCounter.propTypes = {
    cancel: PropTypes.bool,
    fade: PropTypes.bool,
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    value: PropTypes.number
};

export default AbilityCounter;
