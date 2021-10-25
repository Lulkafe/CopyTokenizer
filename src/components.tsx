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

    const { state, dispatch } = useContext(TokenizerContext);
    const { highlightToken, removeHighlight, removedChars } = state;
    const onSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted');
        console.log(e.target.token_clicked.value)
        console.log(e.target.hl_clicked_again.value)
        console.log(e.target.removedChars.value)
    }

    return (
        <div>
            {/* TODO: This button element is temporary.
                will replace with a setting icon later */}
            <button type='button'>Open</button>
            <div id='nav__setting-window'>
                <form onSubmit={onSubmit}>
                    <ul>
                        <li>Do you want to highlight a token when you click it?</li>
                        <div>
                            <input 
                                type='radio' name='token_clicked' 
                                id='nav__setting-radio-hl__yes' 
                                defaultChecked={highlightToken}
                                value={'true'}/>
                            <label htmlFor='nav__setting-radio-hl'>Yes</label>
                            <br/>
                            <input 
                                type='radio' name='token_clicked' 
                                id='nav__setting-radio-hl__no'
                                defaultChecked={!highlightToken}
                                value={'false'}/>
                            <label htmlFor='nav__setting-radio-hl'>No</label>
                            <br/>
                        </div>
                        <li>Do you want to remove the highlight 
                            when you click the token again?</li>
                        <div>
                            <input type='radio' 
                                name='hl_clicked_again' 
                                id='nav__setting-radio-hlagain__yes' 
                                defaultChecked={removeHighlight}
                                value={'true'}/>
                            <label htmlFor='nav__setting-radio-hlagain'>Yes</label>
                            <br/>
                            <input type='radio' 
                                name='hl_clicked_again' 
                                id='nav__setting-radio-hlagain__no'
                                defaultChecked={!removeHighlight}
                                value={'false'}/>
                            <label htmlFor='nav__setting-radio-hlagain'>No</label>
                            <br/>
                        </div>

                        <li>Enter characters you don't want to include 
                            in output tokens. (These will be converted into spaces)</li>
                        <input type='text' placeholder='e.g. ,.-()[]' 
                            defaultValue={removedChars}
                            name='removedChars'>
                        </input>

                        <div>
                            <button type='button'>Cancel</button>
                            <button type='submit'>OK</button>
                        </div>
                    </ul>
                </form>
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