import { ADD_TODO ,REMOVE_TODO , UPDATE_TODO } from '../../constents';
import { addTodo, removeTodo, updateTodo } from '../../Redux/Actions'

describe("Todos Actions", () => {

    it("Add a new TODO", () => {

        const result = addTodo({
            id: "123",
            title: "Title",
            desc: "description",
            done: true,
            createAt: "sep"
        });
        expect(result).toEqual({
            type: ADD_TODO,
            payload: {
                id: "123",
                title: "Title",
                desc: "description",
                done: true,
                createAt: "sep"
            }
        });
    });


    it("Delete TODO", () => {
        const result = removeTodo("115");
        expect(result).toEqual({
            type: REMOVE_TODO,
            payload: "115"
        });
    });

    it("Update value of todo", () => {
        const result = updateTodo({
            id: "115",
            title: "Title",
            desc: "description",
            done: true,
            createAt: "sep"
        });
        expect(result).toEqual({
            type: UPDATE_TODO,
            payload: {
                id: "115",
                title: "Title",
                desc: "description",
                done: true,
                createAt: "sep"
            }
        });
    });

});
