import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

class CardStats extends React.Component {
    render() {
        if(this.props.militarySkillSummary && this.props.politicalSkillSummary) {
            var formatModifiers = (modifiers) => {
                return modifiers.reduce((display, modifier, index) => {
                    let sign = index === 0 || modifier.amount < 0 ? '' : ' + ';
                    let regex = /-(\d+)/;
                    return display + sign + modifier.display.replace(regex, ' - $1') + ' (' + modifier.name + ')';
                }, '');
            };

            var militaryModifiersDisplay = formatModifiers(this.props.militarySkillSummary.modifiers);
            var politicalModifiersDisplay = formatModifiers(this.props.politicalSkillSummary.modifiers);

            return (
                <div className='panel menu'>
                    <div>
                        <span className='icon-military' /><span className='stat-value'>{ this.props.militarySkillSummary.skill }</span>
                    </div>
                    <div>
                        <span className='icon-military' /><span className='stat-value'>{ militaryModifiersDisplay }</span>
                    </div>
                    <div>
                        <span className='icon-political' /><span className='stat-value'>{this.props.politicalSkillSummary.skill}</span>
                    </div>
                    <div>
                        <span className='icon-political' /><span className='stat-value'>{ politicalModifiersDisplay }</span>
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
