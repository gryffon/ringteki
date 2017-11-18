import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

const open = keyframes`
    0% {
        transform: scale(.5, .5) translate(0, 0) rotate(0);
    }
`;

const StyledCard = styled.img`
    transform: translate(${ props => props.translateX }px, ${ props => props.translateY }px) rotate(${ props => props.rotate }deg);
    position: absolute;
    z-index: ${ props => props.index };
    box-shadow: ${ props => props.selected && !props.close ? '0 0 8px 7px rgba(0, 128, 0, 0.85)' : props.shadow };
    outline: ${ props => props.selected && !props.close ? 'light solid rgba(0,128,0,0.85)' : ''};
    animation: ${open} ${ props => props.openDuration }s;
    transition: transform .35s;
    border-radius: 15px;
    filter: ${ props => props.selectable ? '' : 'grayscale(60%)' };

    &.exiting {
        transform: translate(0, 0) scale(.6, .6) rotate(0);
        box-shadow: initial;
        outline: initial;
        transition: all ${props => props.exitDuration}
    }
`;

export default function ConflictCard(props) {
    const onClick = props.selected ? props.onSelectClick : props.onClick;
    return (
        <StyledCard
            { ...props }
            className = { props.exiting ? 'exiting' : '' }
            onMouseOut = { props.onMouseOut }
            onMouseEnter = { props.onMouseEnter }
            onClick = { props.selectable ? onClick : undefined }
            src = { `/img/cards/${props.cardId}.jpg` }
        />
    );
}

ConflictCard.propTypes = {
    cardId: PropTypes.string,
    exitDuration: PropTypes.number,
    exiting: PropTypes.bool,
    index: PropTypes.number,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseOut: PropTypes.func,
    onSelectClick: PropTypes.func,
    openDuration: PropTypes.number,
    rotate: PropTypes.number,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    shadow: PropTypes.string,
    translateX: PropTypes.number,
    translateY: PropTypes.number
};
