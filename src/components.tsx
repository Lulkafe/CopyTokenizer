import React from "react";
import { useReducer, useContext, createContext, useState } from "react";
import { initState, TokenizerReducer, ACTION, TokenConfig } from './reducer'
import { linesToElements } from "./textTokenizer";


const TokenizerContext = createContext(undefined);

export default function App () {

    const [state, dispatch] = useReducer(TokenizerReducer, initState);

    return (
        <div>
            <TokenizerContext.Provider value ={{state, dispatch}}>
                <Header />
                <Content>
                    <InputArea />
                    <OutputArea />
                </Content>
            </TokenizerContext.Provider>
        </div>
    )
}

function Header () {

    return (
        <nav>
            <div id='nav__content-wrapper'>
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
    const { colorToken, removeColor, removedChars } = state;
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
                        <li>Grayout a token when clicked</li>
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
                        <input type='text' placeholder='e.g. ,.-()[]' 
                            defaultValue={removedChars}
                            name='removedChars'>
                        </input>
                    </div>
                    <div className='setting-window__btn-wrapper'>
                        <button type='button' onClick={onClickCancel}>Cancel</button>
                        <button type='submit'>OK</button>
                    </div>
                </ul>
            </form>
        </div>
    )
}


function Content (props) {
    return (
        <div id='content__wrapper'>
            {props.children}
        </div>
    )
}

function InputArea () {

    const { dispatch } = useContext(TokenizerContext);
    const onInput = () => {
        const value = (document.getElementById
            ('input-area') as HTMLInputElement).value;
        dispatch({type: ACTION.INPUT.UPDATE, value});
    }

    return (
        <textarea id='input-area' onInput={onInput}></textarea>
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