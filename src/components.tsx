import React from "react";
import { useReducer, useContext, createContext, useEffect } from "react";
import { initState, TokenizerReducer, ACTION, TokenConfig } from './reducer'
import { linesToElements } from "./textTokenizer";
import { useMediaQuery } from "react-responsive";

const TokenizerContext = createContext(undefined);

export default function App () {

    const [state, dispatch] = useReducer(TokenizerReducer, initState);
    const isMobile = useMediaQuery({ query: '(max-width: 601px)'});


    return (
        <div>
            <TokenizerContext.Provider value ={{state, dispatch}}>
                <Header />
                <Content isMobile={isMobile}/>
            </TokenizerContext.Provider>
        </div>
    )
}

function Header () {

    return (
        <nav id='nav-bar'>
            <div id='nav-bar__content-wrapper'>
                {/* This Icon is temporary.
                    Will replace with a setting icon later */}
                <button type='button'>Icon</button>
                <SettingMenu/>
            </div>
        </nav>
    )
}

function SettingMenu () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { settingMenuOpen } = state;
    const onClickSettingIcon = () => {
        dispatch({ type: ACTION.SETTING.TOGGLE_DISPLAY });
    }
    
    return (
        <div id='setting-component-wrapper'>
            {/* TODO: This button element is temporary.
                will replace with a setting icon later */}
            <button type='button' onClick={onClickSettingIcon}>Open</button>
            { settingMenuOpen && <SettingWindow/>}
        </div>
    )
}

function SettingWindow () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { colorToken, removedChars } = state;
    const onClickCancel = () => {
        dispatch({ type: ACTION.SETTING.CLOSE });
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const settings = {
            colorToken: e.target.token_clicked.value === 'on',
            removedChars: e.target.removedChars.value
        }
        dispatch({ type: ACTION.SETTING.UPDATE, settings });
        dispatch({ type: ACTION.SETTING.CLOSE });
    }

    return (
        <div id='setting-window'> 
            <form onSubmit={onSubmit}>
                <ul>
                    <div className='setting-window__item-wrapper'>
                        <li>Grayout clicked tokens </li>
                        <input 
                            type='radio' name='token_clicked' 
                            id='setting-window__radio-color--yes' 
                            defaultChecked={colorToken}
                            value={'on'}/>
                        <label htmlFor='setting-radio-color--yes'>On</label>
                        <br/>
                        <input 
                            type='radio' name='token_clicked' 
                            id='setting-window__radio-color--no'
                            defaultChecked={!colorToken}
                            value={'off'}/>
                        <label htmlFor='setting-window__radio-color--no'>Off</label>
                        <br/>
                    </div>
                    <div className='setting-window__item-wrapper'>
                        <li>Enter characters you don't want to include 
                            in output tokens. (These will be converted into spaces)</li>
                        <input type='text' 
                            id='setting-window__user-input' 
                            placeholder='e.g. ,.-()[]' 
                            defaultValue={removedChars}
                            name='removedChars'>
                        </input>
                    </div>
                    <div className='setting-window__btn-wrapper'>
                        <button type='button' 
                            id='setting-window__cancel-button'
                            onClick={onClickCancel}>Cancel</button>
                        <button type='submit'
                            id='setting-window__save-button'>Save</button>
                    </div>
                </ul>
            </form>
        </div>
    )
}


function Content (props) {
    const { isMobile } = props;
    const { state, dispatch } = useContext(TokenizerContext);
    const { displayInput, originalInputText } = state;
    const onClick = () => {
        if(displayInput) {
            const value = (document.getElementById
                ('input-area') as HTMLInputElement).value;
            dispatch({type: ACTION.INPUT.KEEP, value });
        }
        
        dispatch({type: ACTION.DISPLAY.TOGGLE})
    }
    

    if (isMobile)
        return (
            <div id='content-wrapper'>
                { displayInput? 
                    <InputArea defaultText={originalInputText}/> : 
                    <OutputArea/>}
                <div id='display-toggle-btn-wrapper'>
                    {/* Toggle Input/Output. should be replaced later/*/}
                    <button type='button' id='display-toggle-btn' onClick={onClick}>SW</button>
                </div>
            </div> 
        )
    else 
        return (
        <div id='content-wrapper'>
            <InputArea/>
            <OutputArea/>
        </div>
    )
}

function InputArea (props) {

    const { dispatch } = useContext(TokenizerContext);
    const defaultText = props.defaultText;
    const onInput = () => {
        const value = (document.getElementById
            ('input-area') as HTMLInputElement).value;
        dispatch({type: ACTION.INPUT.UPDATE, value});
    }
    const onClick = () => {
        (document.getElementById('input-area') as HTMLInputElement).value = '';
        dispatch({type: ACTION.INPUT.CLEAR});
    }

    return (
        <div id='input-area-wrapper'>
            <div id='clear-btn-container'>
                <button type='button' onClick={onClick}>X</button>
            </div>
            <textarea id='input-area' onInput={onInput}
                defaultValue={defaultText}></textarea>
        </div>
    )
}

function OutputArea () {

    const { state } = useContext(TokenizerContext);
    const { input, processType, removedChars, colorToken } = state;
    let config: TokenConfig = {
        processType,
        removedChars,
        colorToken
    }

    return (
        <div id='output-area'>
                { linesToElements(input, config) }
        </div> 
    )
}