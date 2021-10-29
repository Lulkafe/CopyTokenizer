import { textToLines } from './textTokenizer';
import { Process } from './enum';

export interface TokenConfig {
    processType: Process
    removedChars: string
    colorToken: boolean
}

export const initState = {
    input: [],
    processType: Process.perWord,
    removedChars: '',
    colorToken: true, 
    removeColor: true,
    settingMenuOpen: true
}

export const ACTION = {
    INPUT: {
        UPDATE: 'User inputs text',
        CLEAR: 'Clear input'
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

    console.log('New event dispatched');
    console.log(action);
    console.log(state);

    switch (action.type) {
        case ACTION.INPUT.UPDATE:
            return {
                ...state,
                input: textToLines(action.value)
            };
        
        case ACTION.INPUT.CLEAR:
            return {
                ...state,
                input: []
            }

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
                colorToken: action.settings.colorToken, 
                removeColor: action.settings.removeColor
            }
        }
    }
            
    return state;
}