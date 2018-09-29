import { combineReducers } from 'redux';
import DefaultReducer from './DefaultReducer';

const rootReducer = combineReducers({
        todos: DefaultReducer,
});

export default rootReducer;
