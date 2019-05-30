import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

class CardStats extends React.Component {
    render() {
        if(this.props.militarySkillSummary) {
            var modifiersDisplay = this.props.militarySkillSummary.modifiers.reduce((display, modifier, index) => {
                let sign = index === 0 || modifier.amount < 0 ? '' : ' + ';
                let regex = /-\d+/;
                return display + sign + modifier.display.replace(regex, ' - ') + ' (' + modifier.name + ')';
            }, '');

            return (
                <div className='panel menu'>
                    <div>
                        <span className='icon-military' /><span className='stat-value'>{ this.props.militarySkillSummary.skill }</span>
                    </div>
                    <div>
                        <span className='icon-military' /><span className='stat-value'>{ modifiersDisplay }</span>
                    </div>
                </div>
            );
        }
    }
}

CardStats.displayName = 'CardStats';
CardStats.propTypes = {
    militarySkillSummary: PropTypes.object,
    politicalSkillSummary: PropTypes.object,
    text: PropTypes.string
};

export default CardStats;
