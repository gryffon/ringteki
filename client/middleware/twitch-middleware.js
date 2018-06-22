export default function twitchMiddleware({dispatch, getState}) {
    return next => action => {
        const {
            types,
            shouldBroadcastToTwitch = () => false,
            callTwitch
        } = action;
        
        if(!types) {
            return;
        }

        if(!shouldBroadcastToTwitch(getState())) {
            return;
        }

        if(typeof callTwitch !== 'function') {
            throw new Error('Expected callTwitch to be a function.');
        }

        let result = next(action);
        return result;
    };
}