export const closeHand = () => ({ type: 'HAND_CLOSE' });

export const openHand = () => ({ type: 'HAND_OPEN' });

export const playCardsFromHand = (cards) => ({
    type: 'HAND_PLAY_CARDS',
    payload: cards
});
