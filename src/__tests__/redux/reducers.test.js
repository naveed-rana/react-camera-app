import { ADD_TODO, REMOVE_TODO, UPDATE_TODO } from '../../constents';

import DefaultReducer from '../../Redux/reducers/DefaultReducer';
import fakeArray from "../../Redux/reducers/fakeArray";

let state = {
    defaultData: fakeArray,
};

describe("Todo Reducer", () => {

    it("Should add a new todo", () => {
        let todoItem = {
            id: "115",
            title: "Title",
            desc: "description",
            done: true,
            createAt: "sep"
        };

        const result = DefaultReducer(state, {
            type: ADD_TODO,
            payload: todoItem
        });

        expect(result).toEqual(Object.assign({}, state, { defaultData: [...state.defaultData, todoItem] }));
    });

    it("Should Remove todo", () => {
        const result = DefaultReducer(state, {
            type: REMOVE_TODO,
            payload: "116"
        });
        expect(result).toEqual({
            defaultData: [fakeArray[0], fakeArray[2]]
        });
    });

    it("Should Update the todo", () => {
        const result = DefaultReducer(state, {
            type: UPDATE_TODO,
            payload: {
                id: "117",
                title: "Title",
                desc: "description",
                done: true,
                createAt: "sep"
            }
        });
        expect(result.defaultData[2].done).toEqual(true);
    });

});
