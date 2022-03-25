import { textToLines } from './textTokenizer';

export interface TokenConfig {
    removedChars: string
    colorToken: boolean,
    splitBySpace: boolean
}

export const initState = {
    input: [],               //User input splited by lines
    originalInputText: '',   //Original user input text as is (string)
    removedChars: '',
    colorToken: true,
    splitBySpace: true,
    settingMenuOpen: false,      
    displayInput: true      //Only for Mobile
}

export const ACTION = {
    INPUT: {
        UPDATE: 'User inputs the text field',
        CLEAR: 'Clear input',
        KEEP: 'Keep original input text'
    },
    MODE: {
        SPACE: 'Change token type to Whitespace mode',
        LINE: 'Change token type to Line mode'
    },
    DISPLAY: {
        TOGGLE: 'Toggle Input/Output field'
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
                input: textToLines(action.value),
                originalInputText: action.value
            };
        
        case ACTION.INPUT.CLEAR:
            return {
                ...state,
                input: []
            }
        
        case ACTION.INPUT.KEEP:
            return {
                ...state,
                originalInputText: action.value
            }

        case ACTION.DISPLAY.TOGGLE:
            return {
                ...state,
                displayInput: state.displayInput? false : true
            }

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
            return {
                ...state,
                removedChars: action.settings.removedChars,
                colorToken: action.settings.colorToken,
                splitBySpace: action.settings.splitBySpace
            }
        }
    }
            
    return state;
}