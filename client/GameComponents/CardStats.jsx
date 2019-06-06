import React from 'react';
import PropTypes from 'prop-types';

class CardStats extends React.Component {
    render() {
        if(this.props.militarySkillSummary && this.props.politicalSkillSummary && this.props.text) {
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
                <div className='panel menu card--stats '>
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-military stat--type-icon' />
                            <span className='stat-value'>{ this.props.militarySkillSummary.skill }</span>
                        </div>
                        <div className='stat-specifics'>
                            <span>{ militaryModifiersDisplay }</span>
                        </div>
                    </div>
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-political stat--type-icon' />
                            <span className='stat-value'>{ this.props.politicalSkillSummary.skill }</span>
                        </div>
                        <div className='stat-specifics'>
                            <span>{ politicalModifiersDisplay }</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

CardStats.displayName = 'CardStats';
CardStats.propTypes = {
    militarySkillSummary: PropTypes.object,
    politicalSkillSummary: PropTypes.object,
    text: PropTypes.string
};

export default CardStats;
