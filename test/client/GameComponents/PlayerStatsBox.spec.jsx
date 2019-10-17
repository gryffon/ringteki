/* eslint-disable no-unused-vars */
/* global describe, it, expect, document */
/* eslint camelcase: 0, no-invalid-this: 0 */

import PlayerStatsBox from '../../../client/GameComponents/PlayerStatsBox.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TestUtils from 'react-dom/test-utils';

describe('The <PlayerStatsBox /> component', () => {
    const stats = {
        conflictsRemaining: 2,
        politicalRemaining: 1,
        militaryRemaining: 1,
        fate: 7,
        honor: 10
    };
    const user = {
        emailHash: 'asdasdasd',
        username: 'Name'
    };

    describe('when rendered for opposite player with active user', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ true }
                handSize={ 4 }
                otherPlayer={ true }
                sendGameMessage={ () => {} }
                showControls={ false }
                spectating={ false }
                stats={ stats }
                user={ user }
            />,
            document.createElement('div')
        );

        it('should render hand size, fate and honor stats without buttons', () => {
            const images = TestUtils.scryRenderedDOMComponentsWithClass(component, 'stat-image');

            expect(images.length).toBe(3);
            expect(images[0].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/conflictcard.png)');
            expect(images[1].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Fate.png)');
            expect(images[2].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Honor.png)');
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-stat').length).toBe(0);
        });
        
        it('should render conflicts remaining', () => {
            const conflicts = TestUtils.scryRenderedDOMComponentsWithClass(component, 'conflicts-remaining');

            expect(conflicts.length).toBe(1);
            expect(conflicts[0].innerText).toBe('Conflicts: 2');
        });
    });

    describe('when rendered for current player with active user', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ true }
                handSize={ 4 }
                otherPlayer={ false }
                sendGameMessage={ () => {} }
                showControls={ true }
                spectating={ false }
                stats={ stats }
                user={ user }
            />,
            document.createElement('div')
        );

        it('should render hand size, fate and honor stats with buttons', () => {
            const images = TestUtils.scryRenderedDOMComponentsWithClass(component, 'stat-image');

            expect(images.length).toBe(3);
            expect(images[0].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/conflictcard.png)');
            expect(images[1].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Fate.png)');
            expect(images[2].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Honor.png)');
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-stat').length).toBe(4);
        });

        it('should render conflicts remaining', () => {
            const conflicts = TestUtils.scryRenderedDOMComponentsWithClass(component, 'conflicts-remaining');

            expect(conflicts.length).toBe(1);
            expect(conflicts[0].innerText).toBe('Conflicts: 2');
        });
    });

    describe('when rendered for opposite player with spectator', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ true }
                handSize={ 4 }
                otherPlayer={ true }
                sendGameMessage={ () => {} }
                showControls={ false }
                spectating={ true }
                stats={ stats }
                user={ user }
            />,
            document.createElement('div')
        );

        it('should render fate and honor stats without buttons', () => {
            const images = TestUtils.scryRenderedDOMComponentsWithClass(component, 'stat-image');

            expect(images.length).toBe(3);
            expect(images[0].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/conflictcard.png)');
            expect(images[1].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Fate.png)');
            expect(images[2].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Honor.png)');
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-stat').length).toBe(0);
        });

        it('should render conflicts remaining', () => {
            const conflicts = TestUtils.scryRenderedDOMComponentsWithClass(component, 'conflicts-remaining');

            expect(conflicts.length).toBe(1);
            expect(conflicts[0].innerText).toBe('Conflicts: 2');
        });
    });

    describe('when rendered for current player with spectator', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ true }
                handSize={ 4 }
                otherPlayer={ false }
                sendGameMessage={ () => {} }
                showControls={ false }
                spectating={ true }
                stats={ stats }
                user={ user }
            />,
            document.createElement('div')
        );

        it('should render fate and honor stats without buttons', () => {
            const images = TestUtils.scryRenderedDOMComponentsWithClass(component, 'stat-image');

            expect(images.length).toBe(3);
            expect(images[0].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/conflictcard.png)');
            expect(images[1].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Fate.png)');
            expect(images[2].style.getPropertyValue('background-image'))
                .toBe('url(http://localhost:9877/img/Honor.png)');
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-stat').length).toBe(0);
        });

        it('should render conflicts remaining', () => {
            const conflicts = TestUtils.scryRenderedDOMComponentsWithClass(component, 'conflicts-remaining');

            expect(conflicts.length).toBe(1);
            expect(conflicts[0].innerText).toBe('Conflicts: 2');
        });
    });

    describe('when rendered for first player', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ true }
                handSize={ 0 }
                otherPlayer={ true }
                sendGameMessage={ () => {} }
                showControls={ false }
                spectating={ false }
                stats={ {} }
                user={ {} }
            />,
            document.createElement('div')
        );

        it('should render first player indicator', () => {
            const indicator = TestUtils.scryRenderedDOMComponentsWithClass(component, 'first-player-indicator');
            expect(indicator.length).toBe(1);
        });
    });

    describe('when rendered for second player', () => {
        const component = ReactDOM.render(
            <PlayerStatsBox
                firstPlayer={ false }
                handSize={ 0 }
                otherPlayer={ true }
                sendGameMessage={ () => {} }
                showControls={ false }
                spectating={ false }
                stats={ {} }
                user={ {} }
            />,
            document.createElement('div')
        );

        it('should not render first player indicator', () => {
            const indicator = TestUtils.scryRenderedDOMComponentsWithClass(component, 'first-player-indicator');
            expect(indicator.length).toBe(1);
            expect(indicator[0].classList.contains('hidden')).toBe(true);
        });
    });
});
