import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import EmojiConvertor from 'emoji-js';
import uuid from 'uuid';

import Avatar from '../Avatar.jsx';
import * as actions from '../actions';

class InnerMessages extends React.Component {
    constructor() {
        super();

        this.state = {
            message: ''
        };

        this.iconsConflict = [
            'military',
            'political'
        ];

        this.iconsElement = [
            'air',
            'earth',
            'fire',
            'water',
            'void'
        ];

        this.iconsClan = [
            'crab',
            'crane',
            'dragon',
            'lion',
            'phoenix',
            'scorpion',
            'unicorn'
        ];

        this.otherIcons = {
            fate: { className: 'icon-fate', imageSrc: '/img/Fate.png' },
            honor: { className: 'icon-honor', imageSrc: '/img/Honor.png' },
            card: { className: 'icon-card', imageSrc: '/img/cards/conflictcardback.jpg' },
            cards: { className: 'icon-card', imageSrc: '/img/cards/conflictcardback.jpg' }
        };

        this.formatMessageText = this.formatMessageText.bind(this);

        this.emoji = new EmojiConvertor();
    }

    getMessage() {
        var messages = _.map(this.props.messages, message => {
            return <div key={ 'message' + uuid() } className='message'>{ this.formatMessageText(message.message) }</div>;
        });

        return messages;
    }

    formatMessageText(message) {
        var index = 0;
        return _.map(message, (fragment, key) => {
            if(_.isNull(fragment) || _.isUndefined(fragment)) {
                return '';
            }

            if(key === 'alert') {
                let message = this.formatMessageText(fragment.message);

                switch(fragment.type) {
                    case 'endofround':
                        return (
                            <div className='separator'>
                                <hr />
                                { message }
                                <hr />
                            </div>
                        );
                    case 'success':
                        return (<div className='alert alert-success'>
                            <span className='glyphicon glyphicon-ok-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'info':
                        return (<div className='alert alert-info'>
                            <span className='glyphicon glyphicon-info-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'danger':
                        return (<div className='alert alert-danger'>
                            <span className='glyphicon glyphicon-exclamation-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'warning':
                        return (<div className='alert alert-warning'>
                            <span className='glyphicon glyphicon-warning-sign' />&nbsp;
                            { message }
                        </div>);
                }
                return message;
            } else if(fragment.message) {
                return this.formatMessageText(fragment.message);
            } else if(fragment.emailHash) {
                return (
                    <div key={ index++ }>
                        <Avatar emailHash={ fragment.emailHash } forceDefault={ fragment.noAvatar } float />
                        <span key={ index++ }>
                            <b>{ fragment.name }</b>
                        </span>
                    </div>
                );
            } else if(fragment.id) {
                if(fragment.type === 'ring') {
                    return this.formatMessageText(['the ', fragment.element, ' ring']);
                } else if(fragment.type === 'player') {
                    return fragment.name;
                }
                if(fragment.type === '') {
                    return fragment.label;
                }
                return (
                    <span key={ index++ }
                        className='card-link'
                        onMouseOver={ this.props.onCardMouseOver.bind(this, fragment) }
                        onMouseOut={ this.props.onCardMouseOut.bind(this) }>
                        { fragment.name }
                    </span>
                );
            } else if(_.contains(this.iconsConflict, fragment)) {
                return (
                    <span className={ 'icon-' + fragment } key={ index++ } ><span className='hide-text'>{ fragment }</span></span>
                );
            } else if(_.contains(this.iconsElement, fragment)) {
                return (
                    <span className={ 'icon-element-' + fragment } key={ index++ } ><span className='hide-text'>{ fragment }</span></span>
                );
            } else if(_.contains(this.iconsClan, fragment)) {
                return (
                    <span className={ 'icon-clan-' + fragment } key={ index++ } ><span className='hide-text'>{ fragment }</span></span>
                );
            } else if(this.otherIcons[fragment]) {
                return (
                    <img className={ this.otherIcons[fragment].className } key={ index++ } title={ fragment } src={ this.otherIcons[fragment].imageSrc }/>
                );
            } else if(_.isString(fragment)) {
                return this.emoji.replace_colons(fragment);
            } else if(fragment.isReactComponent) {
                return fragment;
            } else if(typeof(fragment) === 'number') {
                return fragment;
            }
            return '[ERROR: Non-Component in message!]';
        });
    }

    render() {
        return <div>{ this.getMessage() }</div>;
    }
}

InnerMessages.displayName = 'Messages';
InnerMessages.propTypes = {
    messages: PropTypes.array,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Messages = connect(mapStateToProps, actions)(InnerMessages);

export default Messages;
export { InnerMessages };

