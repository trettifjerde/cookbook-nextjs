import { useCallback, useReducer } from "react";

type ErrorsState = {[key: string]: Set<string>};

type TouchAction = {
    type: 'TOUCH',
    key: string,
    value: string
};
type ClearAction = {
    type: 'CLEAR_ERRORS'
}
type SetAction<T> = {
    type: 'SET_ERRORS',
    payload: T
}

type Action<T> = TouchAction | SetAction<T> | ClearAction;

export default function useErrors(initializer: () => ErrorsState){
    console.log()
    const [errors, dispatch] = useReducer((state: ErrorsState, action: Action<ErrorsState>) => {
        switch (action.type) {
            case 'TOUCH':
                const upd = {...state};
                upd[action.key].delete(action.value);
                return upd;
            case 'CLEAR_ERRORS':
                return initializer();
            case 'SET_ERRORS':
                return {...action.payload};
            default:
                return state;
        }}, null, initializer);

    const clearErrors = useCallback(() => dispatch({type: 'CLEAR_ERRORS'}), [dispatch]);
    const setErrors = useCallback((errs: ErrorsState) => dispatch({type: 'SET_ERRORS', payload: errs}), [dispatch]);
    const touchField = useCallback((key: string, value: string) => dispatch({type: 'TOUCH', key, value}), [dispatch]);

    return {errors, clearErrors, setErrors, touchField};
}