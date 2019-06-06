const _ = require('underscore');
import React from 'react';
import PropTypes from 'prop-types';

class CardStats extends React.Component {
    render() {
        if(this.props.militarySkillSummary && this.props.politicalSkillSummary && this.props.text) {
            var renderGroupedModifier = (groupedModifier) => {
                let amount = groupedModifier.reduce((total, modifier) => total + modifier.amount, 0);
                let sign = '';
                let amountDisplay = '';
                if(!Number.isNaN(amount)) {
                    sign = amount < 0 ? '-' : '+';
                    amountDisplay = amount.toString().replace('-', '');
                } else {
                    amountDisplay = '-';
                }
                return (
                    <div className='stat-line'>
                        <div className='stat-sign'>{ sign }</div>
                        <div className='stat-amount'>{ amountDisplay }</div>
                        <div className='stat-name'>{ groupedModifier[0].name }</div>
                    </div>
                );
            };

            var renderModifiers = (modifiers) => {
                let groupedModifiers = Object.values(_.groupBy(modifiers, 'name'));
                return groupedModifiers.map((groupedModifier, index) => {
                    return <p>{ renderGroupedModifier(groupedModifier, index) }</p>;
                });
            };

            var militaryModifiersDisplay = renderModifiers(this.props.militarySkillSummary.modifiers);
            var politicalModifiersDisplay = renderModifiers(this.props.politicalSkillSummary.modifiers);

            return (
                <div className='panel menu card--stats '>
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-military stat--type-icon' />
                            <span className='stat-value'>{ this.props.militarySkillSummary.skill }</span>
                        </div>
                        <div className='stat-specifics'>
                            { militaryModifiersDisplay }
                        </div>
                    </div>
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-political stat--type-icon' />
                            <span className='stat-value'>{ this.props.politicalSkillSummary.skill }</span>
                        </div>
                        <div className='stat-specifics'>
                            { politicalModifiersDisplay }
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
