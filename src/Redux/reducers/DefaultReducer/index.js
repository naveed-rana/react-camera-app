import { ADD_TODO, REMOVE_TODO, UPDATE_TODO } from '../../../constents';

const INITIAL_STATE = {
    defaultData: [],
    adsSuccess: '',
    adsErr: ''

};

function DefaultReducer(state = INITIAL_STATE, action) {
    switch (action.type) {

        case ADD_TODO:
            {
                var list = state.defaultData;
                var newList = list.concat([action.payload]);
                return {
                    ...state,
                    defaultData: newList
                }
            }

        case REMOVE_TODO:
            {
                var list = state.defaultData;

                ////////
                // Take an id in the form of payload
                ////////
                let id = action.payload;
                let newList = list.filter((item) => item.id != id);
                return ({
                    ...state,
                    defaultData: newList
                });
            }

        case UPDATE_TODO:
            {
                return Object.assign({}, state, {
                    defaultData: state.defaultData.map((todo) => {
                        if (todo.id == action.payload.id)
                            todo = action.payload
                        return todo
                    })
                })
            }

        default:
            return state;
    }
}

export default DefaultReducer;