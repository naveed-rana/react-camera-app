import { ADD_TODO ,REMOVE_TODO , UPDATE_TODO } from '../../constents';

//Call Reducer

export function addTodo(data) {
    return{
        type:ADD_TODO,
        payload: data
    }
}


export function removeTodo(data) {
    return {
        type: REMOVE_TODO,
        payload: data
    }
}

export function updateTodo(data) {
    return {
        type: UPDATE_TODO,
        payload: data
    }
}