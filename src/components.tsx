import React from "react";
import { useReducer, useContext, createContext, useRef } from "react";
import { initState, TokenizerReducer, ACTION, TokenConfig } from './reducer'
import { linesToElements } from "./textTokenizer";
import { useMediaQuery } from "react-responsive";
import SiteLogo from './image/site-logo.png';
import SettingIcon from './image/setting_icon.png';
import SwitchIcon from './image/arrows.png';
import ClearIcon from './image/clear_icon.png';
import { placeholderText } from "./input-placeholder";

const TokenizerContext = createContext(undefined);

export default function App () {

    const [state, dispatch] = useReducer(TokenizerReducer, initState);
    const isMobile = useMediaQuery({ query: '(max-width: 601px)'});
    const onClick = (e) => {
        if (!e.target.closest('#setting-window'))
           dispatch({ type: ACTION.SETTING.CLOSE });
    }

    return (
        <div onClick={onClick}>
            <TokenizerContext.Provider value={{state, dispatch}}>
                <Header isMobile={isMobile}/>
                <Content isMobile={isMobile}/>
            </TokenizerContext.Provider>
        </div>
    )
}

function Header (props) {

    const isMobile = props.isMobile;

    //Used to align the site icon to center,
    //and the setting icon to the right
    const DummyNavItem = () => 
        <span className='nav-bar__dummy-item'></span>

    return (
        <nav className='nav-bar'>
            <div className='nav-bar__wrapper'>
                { isMobile && <DummyNavItem /> }
                <div className='nav-bar__site-logo-wrapper'>
                    <img src={SiteLogo} className='nav-bar__site-logo' alt='Site logo'/>
                </div>
                <div className='nav-bar__menu-wrapper'>
                    <GeneralSettings/>
                </div>
            </div>
        </nav>
    )
}

function GeneralSettings () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { settingMenuOpen } = state;
    const onClickSettingIcon = (e) => {
        e.stopPropagation();
        dispatch({ type: ACTION.SETTING.TOGGLE_DISPLAY });
    }
    const cls = 'setting-icon__wrapper' + 
        (settingMenuOpen? ' setting-icon__wrapper--menu-open' : '')
    
    return (
        <div>
            <div className={cls} onClick={onClickSettingIcon}>
                <img src={SettingIcon} className='setting-icon' />
            </div>
            <div className='setting-window__wrapper'>
                { settingMenuOpen && <SettingsWindow/>}
            </div>
        </div>
    )
}

function SettingsWindow () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { colorToken, removedChars, splitBySpace } = state;
    const onClickCancelButton = (e) => {
        e.stopPropagation();
        dispatch({ type: ACTION.SETTING.CLOSE });
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const settings = {
            splitBySpace: e.target.split_by.value === 'on',
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
                    {/* First setting - Split text by line or whitespace */}
                    <div className='setting-window__item-wrapper'>
                        <li><span className='setting-window__item-dot'>&#8226; </span><span className='setting-window__item-header'>Split text by...</span> </li>
                        <input 
                            type='radio' name='split_by' 
                            defaultChecked={splitBySpace}
                            value={'on'}/>
                        <label htmlFor='setting-radio-color--yes'><span></span>Words</label>
                        <br/>
                        <input 
                            type='radio' name='split_by' 
                            defaultChecked={!splitBySpace}
                            value={'off'}/>
                        <label htmlFor='setting-window__radio-color--no'>New lines</label>
                        <br/>
                    </div>

                    {/* Second setting - Gray-out or not */}
                    <div className='setting-window__item-wrapper'>
                        <li><span className='setting-window__item-dot'>&#8226; </span><span className='setting-window__item-header'>Gray-out clicked tokens</span></li>
                        <input 
                            type='radio' name='token_clicked' 
                            defaultChecked={colorToken}
                            value={'on'}/>
                        <label htmlFor='setting-radio-color--yes'>Yes</label>
                        <br/>
                        <input 
                            type='radio' name='token_clicked' 
                            defaultChecked={!colorToken}
                            value={'off'}/>
                        <label htmlFor='setting-window__radio-color--no'>No</label>
                        <br/>
                    </div>

                    {/* Third setting - Excluding characters */}
                    <div className='setting-window__item-wrapper'>
                        <li><span className='setting-window__item-dot'>&#8226; </span><span className='setting-window__item-header'>Type characters you want to exclude 
                            from output tokens</span></li>
                        <input type='text' 
                            id='setting-window__user-input' 
                            placeholder='e.g. ,.-()[]' 
                            defaultValue={removedChars}
                            maxLength={30}
                            name='removedChars'>
                        </input>
                    </div>
                </ul>
                <div className='setting-window__btn-wrapper'>
                        <button type='button' 
                            className='setting-window__cancel-button'
                            onClick={onClickCancelButton}>Cancel</button>
                        <button type='submit'
                            className='setting-window__save-button'>Save</button>
                </div>
            </form>
        </div>
    )
}


function Content (props) {
    const { isMobile } = props;
    const { state, dispatch } = useContext(TokenizerContext);
    const { displayInput, originalInputText } = state;
    const onClickToggleButton = (e) => {

        e.stopPropagation();

        /* When switching to Output field, keep the input text in state */
        if(displayInput) {
            const value = (document.getElementById
                ('input-area') as HTMLInputElement).value;
            dispatch({type: ACTION.INPUT.KEEP, value });
        }
        
        dispatch({type: ACTION.DISPLAY.TOGGLE})
    }
    
    if (isMobile)
        return (
            <main className='content-wrapper'>
                {/* Only display input or output field on screen */}
                { displayInput? 
                    <InputArea defaultText={originalInputText}/> : <OutputArea isMobile={isMobile}/>}

                {/* Clicable icon to toggle Input <=> Output field */}
                <div className='display-toggle-icon-wrapper'>
                    <img className='display-toggle-icon' src={SwitchIcon} onClick={onClickToggleButton} alt='Toggle icon'/>
                </div>
            </main> 
        )
    else
        return (
            <main className='content-wrapper'>
                <InputArea defaultText={originalInputText}/>
                <OutputArea/>
            </main>
        )
}

function InputArea (props) {
    const { dispatch } = useContext(TokenizerContext);
    const defaultText: string = props.defaultText;
    const placeholder: string = placeholderText;
    const textAreaRef = useRef(null);
    const textAreaClass: string = 'input-area'
    const onInput = () => {
        const value: string = textAreaRef.current.value;
        dispatch({type: ACTION.INPUT.UPDATE, value});
    }
    const onClickClearButton = () => {
        textAreaRef.current.value = '';
        dispatch({type: ACTION.INPUT.CLEAR});
    }

    return (
        <div className='input-area__wrapper'>
            <div className='input-area__clear-button-container'>
                <img className='clear-button' src={ClearIcon} onClick={onClickClearButton} alt='Clear icon'/>
            </div>
            <p className='input-area__header'>Your text</p>
            <textarea 
                id='input-area'
                className={textAreaClass}
                ref={textAreaRef}
                onInput={onInput}
                placeholder={placeholder}
                defaultValue={defaultText}>
            </textarea>
        </div>
    )
}

function OutputArea (props) {
    const { state } = useContext(TokenizerContext);
    const { isMobile } = props;
    const { input, removedChars, colorToken, splitBySpace } = state;
    const headerText = `Tokens (${isMobile? 'Tap' : 'Click'} to copy)`;
    
    let config: TokenConfig = {
        removedChars,
        colorToken,
        splitBySpace
    }

    return (
        <div className='output-area__wrapper'>
            <p className='output-area__header'>{headerText}</p>
            <div className='output-area'>
                { input.length === 0 || input[0] === ''?
                    <span className='output-area__placeholder'>Your tokens appear here when you input your text in the input field</span> 
                    : linesToElements(input, config)
                }
            </div>
        </div> 
    )
}