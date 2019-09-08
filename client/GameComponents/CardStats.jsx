const _ = require('underscore');
import React from 'react';
import PropTypes from 'prop-types';

class CardStats extends React.Component {
    render() {
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
                return renderGroupedModifier(groupedModifier, index);
            });
        };

        return (
            <div className='panel menu card--stats '>
                { this.props.militarySkillSummary &&
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-military stat--type-icon' />
                            <span className='stat-value'>{ this.props.militarySkillSummary.stat }</span>
                        </div>
                        <div className='stat-specifics'>
                            { renderModifiers(this.props.militarySkillSummary.modifiers) }
                        </div>
                    </div>
                }
                { this.props.politicalSkillSummary &&
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <span className='icon-political stat--type-icon' />
                            <span className='stat-value'>{ this.props.politicalSkillSummary.stat }</span>
                        </div>
                        <div className='stat-specifics'>
                            { renderModifiers(this.props.politicalSkillSummary.modifiers) }
                        </div>
                    </div>
                }
                { this.props.glorySummary &&
                    <div className='stat-container'>
                        <div className='stat-total'>
                            <img className='icon-glory stat--type-icon' src='/img/glory.png' />
                            <span className='stat-value'>{ this.props.glorySummary.stat }</span>
                        </div>
                        <div className='stat-specifics'>
                            { renderModifiers(this.props.glorySummary.modifiers) }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

CardStats.displayName = 'CardStats';
CardStats.propTypes = {
    glorySummary: PropTypes.object,
    militarySkillSummary: PropTypes.object,
    politicalSkillSummary: PropTypes.object,
    text: PropTypes.string
};

export default CardStats;
