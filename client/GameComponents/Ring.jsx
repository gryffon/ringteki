const _ = require('underscore');

import React from 'react';
import PropTypes from 'prop-types';

import CardCounters from './CardCounters.jsx';
import CardMenu from './CardMenu.jsx';

class Ring extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            showMenu: false
        };

    }

    onClick(event, ring) {
        event.preventDefault();
        event.stopPropagation();

        if(!_.isEmpty(this.props.ring.menu)) {
            this.setState({ showMenu: !this.state.showMenu });

            return;
        }

        if(this.props.onClick) {
            this.props.onClick(ring);
        }
    }

    onMenuItemClick(menuItem) {
        if(this.props.onMenuItemClick) {
            this.props.onMenuItemClick(this.props.ring, menuItem);
            this.setState({ showMenu: !this.state.showMenu });
        }
    }

    getCountersForRing(ring) {
        var counters = {};

        counters['ring-fate'] = this.props.ring.fate ? { count: this.props.ring.fate, shortName: 'F' } : undefined;

        _.each(ring.tokens, (token, key) => {
            counters[key] = { count: token, fade: ring.type === 'attachment', shortName: this.shortNames[key] };
        });

        var filteredCounters = _.omit(counters, counter => {
            return _.isUndefined(counter) || _.isNull(counter) || counter < 0;
        });

        return filteredCounters;
    }

    showCounters() {
        return true;
    }

    showMenu() {
        if(!this.props.ring.menu || !this.state.showMenu) {
            return false;
        }

        return true;
    }

    getRingInfo() {
        if(!this.props.ring.claimed && !this.props.ring.contested) {
            return (
                <div className='ring-info'>
                    Unclaimed
                </div>
            );
        }
        return (
            <div className='ring-info' >
                { this.getIcon() }
                { this.props.ring.claimed ? ' Claimed: ' + this.props.ring.claimedBy : ' Contested' }
            </div>
        );
    }

    getIcon() {
        if(this.props.ring.conflictType === 'military') {
            return (<span className='icon-military'><span className='hide-text'>military</span></span>);
        }
        return (<span className='icon-political'><span className='hide-text'>political</span></span>);
    }

    render() {
        let size = this.props.size;
        if(this.props.ring.claimed) {
            size = 'small';
        }

        let className = 'ring icon-element-' + this.props.ring.element + ' ' + size;
        let bgClassName = 'ring-background  tint-' + this.props.ring.conflictType + ' ' + size;
        let svgClassName = 'ring-svg ' + size + ' ' + (this.props.ring.selected || this.props.ring.contested ? 'contested' : '');
        if(this.props.ring.unselectable) {
            className = className + ' unselectable';
            bgClassName += ' unselectable';
        }

        let visible = true;
        if((this.props.owner && (!this.props.ring.claimed || this.props.owner !== this.props.ring.claimedBy)) || (!this.props.owner && this.props.ring.claimed)) {
            className += ' hidden';
            svgClassName += ' hidden';
            visible = false;
        }
        return (
            <div className='ring no-highlight' onClick={ event => this.onClick(event, this.props.ring.element) } >
                <svg className={ svgClassName } >
                    <circle cx='50%' cy='50%' r='50%' className={ bgClassName } />
                </svg>
                <span className={ className } />
                { (this.showCounters() && visible) ? <CardCounters counters={ this.getCountersForRing(this.props.ring.element) } /> : null }
                { this.showMenu() ? <CardMenu menu={ this.props.ring.menu } onMenuItemClick={ this.onMenuItemClick } /> : null }
            </div>);
    }
}
//<img className={ className } title={ this.props.ring.element } src={ '/img/' + this.props.ring.conflictType + '-' + this.props.ring.element + '.png' } />
//     <div className={ this.props.ring.claimedBy.length > 12 ? 'ring-info-xs ' : 'ring-info ' } >
//     { this.props.ring.claimed ? 'Claimed: ' + this.props.ring.claimedBy : this.props.ring.contested ? 'Contested' : 'Unclaimed' }
// </div>
Ring.displayName = 'Ring';
Ring.propTypes = {
    buttons: PropTypes.array,
    onClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    owner: PropTypes.string,
    ring: PropTypes.object,
    size: PropTypes.string,
    socket: PropTypes.object
};

export default Ring;
