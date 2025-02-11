import { SET_RETURN_SCREEN } from "./actions"

const initialState = {
    returnScreen: '',
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_RETURN_SCREEN:
            return {
                ...state,
                returnScreen: action.payload,
            };
    }

    return state;
}
