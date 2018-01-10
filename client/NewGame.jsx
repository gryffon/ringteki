import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './actions';

class InnerNewGame extends React.Component {
    constructor() {
        super();

        this.onCancelClick = this.onCancelClick.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onSpectatorsClick = this.onSpectatorsClick.bind(this);
        this.onSpectatorSquelchClick = this.onSpectatorSquelchClick.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);

        this.state = {
            spectators: true,
            spectatorSquelch: false,
            selectedGameFormat: 'duel',
            selectedGameType: 'casual',
            password: ''
        };
    }

    componentWillMount() {
        this.setState({ gameName: this.props.defaultGameName });
    }

    onCancelClick(event) {
        event.preventDefault();

        this.props.cancelNewGame();
    }

    onNameChange(event) {
        this.setState({ gameName: event.target.value.substr(0, 140) });
    }

    onPasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    onSpectatorsClick(event) {
        this.setState({ spectators: event.target.checked });
    }

    onSpectatorSquelchClick(event) {
        this.setState({ spectatorSquelch: event.target.checked });
    }

    onSubmitClick(event) {
        event.preventDefault();

        this.props.socket.emit('newgame', {
            name: this.state.gameName,
            spectators: this.state.spectators,
            spectatorSquelch: this.state.spectatorSquelch,
            gameType: this.state.selectedGameType,
            isMelee: this.state.selectedGameFormat === 'melee',
            password: this.state.password
        });
    }

    onRadioChange(gameType) {
        this.setState({ selectedGameType: gameType });
    }

    onGameFormatChange(format) {
        this.setState({ selectedGameFormat: format });
    }

    isGameTypeSelected(gameType) {
        return this.state.selectedGameType === gameType;
    }

    render() {
        let charsLeft = 140 - this.state.gameName.length;
        return this.props.socket ? (
            <div>
                <div className='panel-title text-center'>
                    New game
                </div>
                <div className='panel'>
                    <form className='form'>
                        <div className='row'>
                            <div className='col-sm-8'>
                                <label htmlFor='gameName'>Name</label>
                                <label className='game-name-char-limit'>{ charsLeft >= 0 ? charsLeft : 0 }</label>
                                <input className='form-control' placeholder='Game Name' type='text' onChange={ this.onNameChange } value={ this.state.gameName } />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='checkbox col-sm-8'>
                                <label>
                                    <input type='checkbox' onChange={ this.onSpectatorsClick } checked={ this.state.spectators } />
                                    Allow spectators
                                </label>
                            </div>
                            <div className='checkbox col-sm-8'>
                                <label>
                                    <input type='checkbox' onChange={ this.onSpectatorSquelchClick } checked={ this.state.spectatorSquelch } />
                                    Don't allow spectators to chat
                                </label>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-sm-12'>
                                <b>Game Type</b>
                            </div>
                            <div className='col-sm-10'>
                                <label className='radio-inline'>
                                    <input type='radio' onChange={ this.onRadioChange.bind(this, 'beginner') } checked={ this.isGameTypeSelected('beginner') } />
                                    Beginner
                                </label>
                                <label className='radio-inline'>
                                    <input type='radio' onChange={ this.onRadioChange.bind(this, 'casual') } checked={ this.isGameTypeSelected('casual') } />
                                    Casual
                                </label>
                                <label className='radio-inline'>
                                    <input type='radio' onChange={ this.onRadioChange.bind(this, 'competitive') } checked={ this.isGameTypeSelected('competitive') } />
                                    Competitive
                                </label>
                            </div>
                        </div>
                        <div className='row game-password'>
                            <div className='col-sm-8'>
                                <label>Password</label>
                                <input className='form-control' type='password' onChange={ this.onPasswordChange } value={ this.state.password } />
                            </div>
                        </div>
                        <div className='button-row'>
                            <button className='btn btn-primary' onClick={ this.onSubmitClick }>Submit</button>
                            <button className='btn btn-primary' onClick={ this.onCancelClick }>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>) : (
            <div>
                    Connecting to the server, please wait...
            </div>
        );
    }
}

InnerNewGame.displayName = 'NewGame';
InnerNewGame.propTypes = {
    allowMelee: PropTypes.bool,
    cancelNewGame: PropTypes.func,
    defaultGameName: PropTypes.string,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        allowMelee: state.auth.user ? state.auth.user.permissions.allowMelee : false,
        socket: state.socket.socket
    };
}

const NewGame = connect(mapStateToProps, actions)(InnerNewGame);

export default NewGame;
