import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class CircleButton extends React.PureComponent {
    render() {
        const {
            borderSize,
            children,
            onClick,
            primary,
            secondary,
            size,
            tertiary,
            turn,
            zIndex
        } = this.props;

        return (
            <StyledCircleButton
                onClick = { onClick }
                className = 'circle-button'
                borderSize = { borderSize }
                primary = { primary }
                secondary = { secondary }
                size = { size }
                tertiary = { tertiary }
                turn = { turn }
                zIndex = { zIndex }
            >
                { children }
            </StyledCircleButton>
        );
    }
}

CircleButton.propTypes = {
    borderSize: PropTypes.number,
    children: PropTypes.node,
    onClick: PropTypes.func,
    primary: PropTypes.string,
    secondary: PropTypes.string,
    size: PropTypes.number,
    tertiary: PropTypes.string,
    turn: PropTypes.bool,
    zIndex: PropTypes.number
};

CircleButton.defaultProps = {
    primary: 'white',
    secondary: 'black',
    turn: false,
    size: 150,
    borderSize: 5,
    zIndex: 1
};

const StyledCircleButton = styled.div`
    width: ${ props => props.size }px;
    height: ${ props => props.size }px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${ props => Math.round(props.size * .6) }px;
    color: ${ props => props.primary };
    border-radius: 50%;
    transition: color .3s, transform .3s;
    border: ${ props => props.borderSize }px solid ${ props => props.primary };
    z-index: ${ props => props.zIndex };

    & > svg {
        fill: ${ props => props.primary };
        stroke: ${ props => props.secondary };
    }
    
    &:before {
        content: '';
        position: absolute;
        margin: 0 auto;
        background-color: ${ props => props.primary };
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        transform: scale(0, 0);
        border-radius: 50%;
        z-index: -1;
        transition: transform .3s;
        box-sizing: border-box;
        border: ${ props => props.borderSize }px solid ${ props => props.secondary };
    }

    &:hover {
        transition: all .3s ease-out;
        color: ${ props => props.tertiary || props.secondary };
        transform: ${ props => props.turn ? 'rotate(90deg)' : '' };
    }
    
    &:hover > svg {
        fill: ${ props => props.tertiary || props.secondary };
        stroke: ${ props => props.primary };
    }

    &:hover:before {
        transform: scale(.95);
        transition: transform .3s;
        transform-origin: center;
    }
`;
