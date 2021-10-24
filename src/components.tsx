import React from "react";
import { useReducer, useContext, createContext, useState } from "react";
import { initState, TokenizerReducer, ACTION } from './reducer'
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

    return (
        <div>
            {/* TODO: This button element is temporary.
                will replace with a setting icon later */}
            <button type='button'>Open</button>
            <div id='nav__setting-window'>
                <ul>
                    <li>Do you want to highlight a token when it is clicked?</li>
                    <div>
                        <input type='radio' name='token-clicked' id='nav__setting-radio-hl__yes' checked/>
                        <label htmlFor='nav__setting-radio-hl'>Yes</label>
                        <br/>
                        <input type='radio' name='token-clicked' id='nav__setting-radio-hl__no'/>
                        <label htmlFor='nav__setting-radio-hl'>No</label>
                        <br/>
                    </div>
                    <li>Do you want to remove the highlight when you click the token again?</li>
                    <div>
                        <input type='radio' name='hl-clicked-again' id='nav__setting-radio-hlagain__yes' checked/>
                        <label htmlFor='nav__setting-radio-hlagain'>Yes</label>
                        <br/>
                        <input type='radio' name='hl-clicked-again' id='nav__setting-radio-hlagain__no'/>
                        <label htmlFor='nav__setting-radio-hlagain'>No</label>
                        <br/>
                    </div>

                    <li>Enter characters you don't want to include in output tokens. (These will be converted into spaces)</li>
                    <input type='text' placeholder='e.g. ,.-()[]'></input>

                    <div>
                        <button type='button'>Cancel</button>
                        <button type='button'>OK</button>
                    </div>
                </ul>
            </div>
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
    const { input, processType } = state;

    return (
        <div id='output-area'>
            { linesToElements(input, processType) }
        </div>
    )
}