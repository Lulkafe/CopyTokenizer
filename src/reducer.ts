import { textToLines } from './textTokenizer';
import { Process } from './enum';

export const initState = {
    input: [],
    processType: Process.perLine,
    removedChars: '',
    highlightToken: true, 
    removeHighlight: true,
    settingMenuOpen: false
}

export const ACTION = {
    INPUT: {
        UPDATE: 'User inputs text'
    },
    MODE: {
        SPACE: 'Change token type to Whitespace mode',
        LINE: 'Change token type to Line mode'
    },
    SETTING: {
        TOGGLE_DISPLAY: 'Show/Close a setting window',
        OPEN: 'Open a setting window',
        CLOSE: 'Close the setting window',
        UPDATE: 'User updates settings'
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

        case ACTION.SETTING.OPEN:
            return {
                ...state,
                settingMenuOpen: true
            }

        case ACTION.SETTING.CLOSE:
            return {
                ...state,
                settingMenuOpen: false
            }

        case ACTION.SETTING.TOGGLE_DISPLAY:
            return {
                ...state,
                settingMenuOpen: !state.settingMenuOpen
            }
        
        case ACTION.SETTING.UPDATE: 
        {
            console.log(action.settings);
            return {
                ...state,
                removedChars: action.settings.removedChars,
                highlightToken: action.settings.highlightToken, 
                removeHighlight: action.settings.removeHighlight
            }
        }
    }
            
    return state;
}