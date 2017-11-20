import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class Overlay extends React.PureComponent {
    render() {
        const { visible = true, density = .9, children } = this.props;
        return (
            <StyledOverlay visible = { visible } density = { density }>
                { children }
            </StyledOverlay>
        );
    }
}

Overlay.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    density: PropTypes.number,
    visible: PropTypes.bool
};

const StyledOverlay = styled.div`
    display: ${ props => props.visible ? 'block' : 'none' };
    background-color: rgba(0, 0, 0, ${props => props.density});
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10000;
`;
