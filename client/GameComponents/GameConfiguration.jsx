import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import Checkbox from '../FormComponents/Checkbox.jsx';

class GameConfiguration extends React.Component {
    constructor(props) {
        super(props);

        this.windows = [
            { name: 'dynasty', label: 'Dynasty phase', style: 'col-sm-4' },
            { name: 'draw', label: 'Draw phase', style: 'col-sm-4' },
            { name: 'preConflict', label: 'Conflict phase', style: 'col-sm-4' },
            { name: 'conflict', label: 'During conflict', style: 'col-sm-4' },
            { name: 'fate', label: 'Fate phase', style: 'col-sm-4' },
            { name: 'regroup', label: 'Regroup phase', style: 'col-sm-4' }
        ];

        this.state = {
            windowTimer: this.props.timerSettings.windowTimer
        };
    }

    onToggle(option, value) {
        if(this.props.onToggle) {
            this.props.onToggle(option, !value);
        }
    }

    onSlideStop(event) {
        let value = parseInt(event.target.value);

        if(_.isNaN(value)) {
            return;
        }

        if(value < 0) {
            value = 0;
        }

        if(value > 10) {
            value = 10;
        }

        this.setState({ windowTimer: value });
    }

    onTimerSettingToggle(option, event) {
        if(this.props.onTimerSettingToggle) {
            this.props.onTimerSettingToggle(option, event.target.checked);
        }
    }

    onOptionSettingToggle(option, event) {
        if(this.props.onOptionSettingToggle) {
            this.props.onOptionSettingToggle(option, event.target.checked);
        }
    }

    render() {
        let windows = _.map(this.windows, window => {
            return (<Checkbox key={ window.name }
                noGroup
                name={ 'promptedActionWindows.' + window.name }
                label={ window.label }
                fieldClass={ window.style }
                type='checkbox'
                onChange={ this.onToggle.bind(this, window.name, this.props.actionWindows[window.name]) }
                checked={ this.props.actionWindows[window.name] } />);
        });

        return (
            <div>
                <form className='form form-horizontal'>
                    <div className='panel-title'>
                        Action window defaults
                    </div>
                    <div className='panel'>
                        <div className='form-group'>
                            { windows }
                        </div>
                    </div>
                    <div className='panel-title text-center'>
                        Timed Interrupt Window
                    </div>
                    <div className='panel'>
                        <div className='form-group'>
                            <Checkbox
                                name='timerSettings.events'
                                noGroup
                                label={ 'Show timer for opponent\'s events' }
                                fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'events') }
                                checked={ this.props.timerSettings.events }
                            />
                            <Checkbox
                                name='timerSettings.eventsInDeck'
                                noGroup
                                label={ 'Show timer for events in your deck' }
                                fieldClass='col-sm-6'
                                onChange={ this.onTimerSettingToggle.bind(this, 'eventsInDeck') }
                                checked={ this.props.timerSettings.eventsInDeck }
                            />
                        </div>
                    </div>
                    <div className='panel-title text-center'>
                        Options
                    </div>
                    <div className='panel'>
                        <div className='form-group'>
                            <Checkbox
                                name='optionSettings.markCardsUnselectable'
                                noGroup
                                label={ 'Grey out cards with no relevant abilities during interrupt/reaction windows' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'markCardsUnselectable') }
                                checked={ this.props.optionSettings.markCardsUnselectable }
                            />
                            <Checkbox
                                name='optionSettings.cancelOwnAbilities'
                                noGroup
                                label={ 'Prompt to cancel/react to initiation of my own abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'cancelOwnAbilities') }
                                checked={ this.props.optionSettings.cancelOwnAbilities }
                            />
                            <Checkbox
                                name='optionSettings.orderForcedAbilities'
                                noGroup
                                label={ 'Prompt to order forced triggered/simultaneous abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'orderForcedAbilities') }
                                checked={ this.props.optionSettings.orderForcedAbilities }
                            />
                            <Checkbox
                                name='optionSettings.confirmOneClick'
                                noGroup
                                label={ 'Show a confirmation prompt when initating 1-click abilities' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'confirmOneClick') }
                                checked={ this.props.optionSettings.confirmOneClick }
                            />
                            <Checkbox
                                name='optionSettings.disableCardStats'
                                noGroup
                                label={ 'Disable card hover statistics popup' }
                                fieldClass='col-sm-6'
                                onChange={ this.onOptionSettingToggle.bind(this, 'disableCardStats') }
                                checked={ this.props.optionSettings.disableCardStats }
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

GameConfiguration.displayName = 'GameConfiguration';
GameConfiguration.propTypes = {
    actionWindows: PropTypes.object,
    onOptionSettingToggle: PropTypes.func,
    onTimerSettingToggle: PropTypes.func,
    onToggle: PropTypes.func,
    optionSettings: PropTypes.object,
    timerSettings: PropTypes.object
};

export default GameConfiguration;
