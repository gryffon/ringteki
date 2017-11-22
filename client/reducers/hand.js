const defaultState = {
    open: false,
    activeCards: []
};

export default function handReducer(state = defaultState, action) {
    switch(action.type) {
        case 'HAND_OPEN':
            return Object.assign({}, state, { open: true });
        case 'HAND_CLOSE':
            return Object.assign({}, state, { open: false});
        case 'HAND_PLAY_CARDS':
            return { open: false, activeCards: action.payload };
        case 'HAND_CANCEL_CARDS':
            return { open: true, activeCards: [] };
        default:
            return state;
    }
}
