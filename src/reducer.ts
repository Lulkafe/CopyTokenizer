import { textToLines } from './textTokenizer';
import { Process } from './enum';

export const initState = {
    input: [],
    processType: Process.perLine,
    removeLetters: '',
    highlightToken: true, 
    removeHighlight: true
}

export const ACTION = {
    INPUT: {
        UPDATE: 'User inputs text'
    },
    MODE: {
        SPACE: 'Change token type to Whitespace mode',
        LINE: 'Change token type to Line mode'
    }
}

export const TokenizerReducer = (state, action) => {

    // console.log('New event dispatched');
    // console.log(action);
    // console.log(state);

    switch (action.type) {
        case ACTION.INPUT.UPDATE:
            return {
                ...state,
                input: textToLines(action.value)
            };

        case ACTION.MODE.LINE:
            return {
                ...state,
                processType: Process.perLine
            };
            
        case ACTION.MODE.SPACE:
            return {
                ...state,
                processType: Process.perWord
            };
        }
            
    return state;
}