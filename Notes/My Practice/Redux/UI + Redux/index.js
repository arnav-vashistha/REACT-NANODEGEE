//LIBRARY CODE
function createStore(reducer) {
    // the state tree
    // a way to get the state tree
    // a way to listen and respond to the state changing
    // a way to update the state


    //State
    let state;

    //Listeners
    let listeners = [];

    // It is a function.
    // When called, it is passed a single function.
    const subscribe = (listener) => {
        listeners.push(listener)
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    }

    //it just returns the state object!
    const getState = () => state;

    //responsible for updating the state inside actual store
    const dispatch = (action) => {
        //using todos reducer function to get updated state
        state = reducer(state, action)

        //invoke all the listeners when state is updated. the user has subscribed to some listeners
        //if state gets updated.
        listeners.forEach(listener => listener())
    }

    //createStore returns an object that publicly exposes the getState() function
    return {
        getState,
        subscribe,
        dispatch
    }
}

//APP CODE

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

//ACTION CREATORS
function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}

function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id,
    }
}

function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id,
    }
}

function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}

function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id,
    }
}


//we call it a reducer function
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            //cancat can be performed only on arrays that's why [action.todo]
            return state.concat([action.todo])
        case REMOVE_TODO:
            //filter the state and return, should not mutate the state directly
            return state.filter(todo => todo.id !== action.id);
        case TOGGLE_TODO:
            //should not mutate the state directly
            return state.map(todo => {
                return todo.id !== action.id ? todo : Object.assign({}, todo, { 'complete': !todo.complete })
            })
        default:
            return state;
    }
}

//Goals reducer
function goals(state = [], action) {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GOAL:
            return state.filter(goal => goal.id !== action.id)
        default:
            return state;
    }
}

//Root reducer
function app(state = {}, action) {
    return {
        'todos': todos(state.todos, action),
        'goals': goals(state.goals, action)
    }
}

// Whenever dispatch is called, we invoke our app function. The app function will then
//  invoke the todos reducer as well as the goals reducer. Those will return their 
//  specific portions of the state. And then, the app function will return a state object 
//  with a todos property (the value of which is what the todos reducer returned)
//  and a goals property (the value of which is what the goals reducer returned).


const store = createStore(app);
// store.subscribe(() => {
//     console.log('The new state is: ', store.getState())
   
// })

let unsbscribe = store.subscribe(() => {
    console.log('The new state is: ', store.getState())
   
})

store.dispatch(addTodoAction({
    id: 0,
    name: 'Walk the dog',
    complete: false,
}))

store.dispatch(addTodoAction({
    id: 1,
    name: 'Wash the car',
    complete: false,
}))

store.dispatch(addTodoAction({
    id: 2,
    name: 'Go to the gym',
    complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
    id: 0,
    name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
    id: 1,
    name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))