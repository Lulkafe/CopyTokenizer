import { textToArray } from './textTokenizer';
import { Process } from './enum';

export const initState = {
    input: [],
    processType: Process.perLine
}

export const ACTION = {
    INPUT: {
        UPDATE: 'User inputs text'
    }
}

export const TokenizerReducer = (state, action) => {

    console.log('New event dispatched');
    console.log(action);
    console.log(state);

    switch (action.type) {
        case ACTION.INPUT.UPDATE:
            return {
                ...state,
                input: textToArray(action.value)
            };

    }

    return state;
}