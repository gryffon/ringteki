import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const open = keyframes`
    0% {
        transform: scale(.5, .5) translate(0, 0) rotate(0);
    }
`;

const StyledCard = styled.img`
    height: ${ props => props.height}px;
    width: ${ props => props.width}px;
    transform: translate(${ props => props.translateX }px, ${ props => props.translateY }px) rotate(${ props => props.rotate }deg);
    position: absolute;
    box-shadow: ${ props => props.selected && !props.close ? '0 0 8px 7px rgba(0, 128, 0, 0.85)' : props.shadow };
    outline: ${ props => props.selected && !props.close ? 'light solid rgba(0,128,0,0.85)' : ''};
    animation: ${open} ${ props => props.durationOpen }s;
    transition: transform .15s;
    border-radius: 15px;
    filter: ${ props => props.selectable || props.selected ? '' : 'grayscale(80%)' };
    background-position-y: -1px;
    bottom: -1px;

    &.exiting {
        transform: translate(0, 0) scale(.6, .6) rotate(0);
        box-shadow: initial;
        outline: initial;
        transition: all ${ props => props.durationExit }
    }
`;

// percentage 0 means the bottom shadow runs across the entire bottom of the card.
function calculateShadow(cardWidth, rotate, percentage) {
    let bottomShadow = rotate < 0
        ? -1 * percentage * cardWidth
        : (1 - percentage) * cardWidth / -4;
    
    return `-3px 0px 6px 0px #2B2B2B, ${bottomShadow}px ${-1 * bottomShadow + 1}px 6px ${bottomShadow}px #2B2B2B`;
}

export default class SelectHandCard extends React.PureComponent {
    render() {
        const {
            cardId,
            durationExit,
            durationOpen,
            exiting,
            height,
            percentage,
            rotate,
            onClick,
            onMouseEnter,
            onMouseOut,
            onSelectClick,
            selectable,
            selected,
            showShadow,
            translateX,
            translateY,
            width
        } = this.props;
    
        const click = selected ? onSelectClick : onClick;
    
        return (
            <StyledCard
                className = { exiting ? 'exiting' : '' }
                durationOpen = { durationOpen }
                durationExit = { durationExit }
                height = { height }
                onMouseOut = { onMouseOut }
                onMouseEnter = { onMouseEnter }
                onClick = { selectable || selected ? click : undefined }
                rotate = { rotate }
                selected = { selected }
                selectable = { selectable }
                shadow = { showShadow ? calculateShadow(width, rotate, percentage) : '' }
                src = { `/img/cards/${cardId}.jpg` }
                translateX = { translateX }
                translateY = { translateY }
                width = { width }
            />
        );
    }
}

SelectHandCard.propTypes = {
    cardId: PropTypes.string,
    durationExit: PropTypes.number,
    durationOpen: PropTypes.number,
    exiting: PropTypes.bool,
    height: PropTypes.number,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseOut: PropTypes.func,
    onSelectClick: PropTypes.func,
    percentage: PropTypes.number,
    rotate: PropTypes.number,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    showShadow: PropTypes.bool,
    translateX: PropTypes.number,
    translateY: PropTypes.number,
    width: PropTypes.number
};

SelectHandCard.defaultProps = {
    durationOpen: .5,
    durationExit: .4,
    exiting: false,
    height: 420,
    percentage: 0,
    rotate: 0,
    selectable: true,
    selected: false,
    showShadow: false,
    translateX: 0,
    translateY: 0,
    width: 300
};
