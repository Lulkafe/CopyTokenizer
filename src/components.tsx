import React from "react";
import { useReducer, useContext, createContext, useEffect } from "react";
import { initState, TokenizerReducer, ACTION, TokenConfig } from './reducer'
import { linesToElements } from "./textTokenizer";
import { useMediaQuery } from "react-responsive";

import SiteIcon from './image/site_icon.png';
import SettingIcon from './image/setting_icon.png';
import SwitchIcon from './image/arrows.png';
import ClearIcon from './image/clear_icon.png';
import LineModeIcon from './image/line_mode_icon.png';
import WordModeIcon from './image/word_mode_icon.png';
import { Process } from "./enum";

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
        <span id='nav-bar__dummy-item'></span>

    return (
        <nav id='nav-bar'>
            <div id='nav-bar-wrapper'>
                { isMobile && <DummyNavItem /> }
                <div className='site-logo__wrapper'>
                    <img src={SiteIcon} id='site-logo'/>
                </div>

                <div id='menu-wrapper'>
                    { isMobile === false && <ModeSetting/>}
                    <GeneralSetting/>
                </div>
            </div>
        </nav>
    )
}

function ModeSetting (props) {
    const isMobile = props.isMobile || false;
    const { state, dispatch } = useContext(TokenizerContext);
    const { processType }= state;
    const onClickWordIcon = () => dispatch({type: ACTION.MODE.SPACE});
    const onClickLineIcon = () => dispatch({type: ACTION.MODE.LINE});

    if (isMobile)
        return(
            <div id='mode-icon-wrapper'>
                <div className={'mode-setting-button' + 
                    (processType === Process.perWord? '' : ' mode-setting-button--grayout')} 
                    id='word-icon-wrapper' onClick={onClickWordIcon}>
                    <img id='word-icon' src={WordModeIcon} />
                </div>
                <div className={'mode-setting-button' +
                    (processType === Process.perLine? '' : ' mode-setting-button--grayout')}
                    id='line-icon-wrapper' onClick={onClickLineIcon}>
                    <img id='line-icon' src={LineModeIcon} />
                </div>
               
            </div>
        )
    else
        return (
            <div id='mode-icon-wrapper'>
                <div className={'mode-setting-button' + 
                    (processType === Process.perWord? '' : ' mode-setting-button--grayout')} 
                    id='word-icon-wrapper' onClick={onClickWordIcon}>
                    <div className='mode-setting-button__content-wrapper'>
                        <img id='word-icon' src={WordModeIcon} />
                        <span>space</span>
                    </div>
                </div>
                <div className={'mode-setting-button' +
                    (processType === Process.perLine? '' : ' mode-setting-button--grayout')}
                    id='line-icon-wrapper' onClick={onClickLineIcon}>
                    <div className='mode-setting-button__content-wrapper'>
                        <img id='line-icon' src={LineModeIcon} />
                        <span>line</span>
                    </div>
                </div>
            </div>
        )
}

function GeneralSetting () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { settingMenuOpen } = state;
    const onClickSettingIcon = (e) => {
        e.stopPropagation();
        dispatch({ type: ACTION.SETTING.TOGGLE_DISPLAY });
    }
    
    return (
        <div>
            <div id='setting-icon-wrapper' onClick={onClickSettingIcon}>
                <img src={SettingIcon} id='setting-icon' />
            </div>
            <div id='setting-window-wrapper'>
                { settingMenuOpen && <SettingWindow/>}
            </div>
        </div>
    )
}

function SettingWindow () {

    const { state, dispatch } = useContext(TokenizerContext);
    const { colorToken, removedChars } = state;
    const onClickCancelButton = (e) => {
        e.stopPropagation();
        dispatch({ type: ACTION.SETTING.CLOSE });
    }
    const onSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
                        <li><span className='setting-window__item-dot'>&#8226; </span>Grayout clicked tokens </li>
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
                        <li><span className='setting-window__item-dot'>&#8226; </span>Enter characters you want to exclude 
                            from output tokens (converted into whitespaces)</li>
                        <input type='text' 
                            id='setting-window__user-input' 
                            placeholder='e.g. ,.-()[]' 
                            defaultValue={removedChars}
                            name='removedChars'>
                        </input>
                    </div>
                </ul>
                <div className='setting-window__btn-wrapper'>
                        <button type='button' 
                            id='setting-window__cancel-button'
                            onClick={onClickCancelButton}>Cancel</button>
                        <button type='submit'
                            id='setting-window__save-button'>Save</button>
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

        if(displayInput) {
            const value = (document.getElementById
                ('input-area') as HTMLInputElement).value;
            dispatch({type: ACTION.INPUT.KEEP, value });
        }
        
        dispatch({type: ACTION.DISPLAY.TOGGLE})
    }
    
    if (isMobile)
        return (
            <main id='content-wrapper'>
                { displayInput? 
                    <InputArea defaultText={originalInputText}/> : 
                    <OutputArea isMobile={true}/>}
                <div id='display-toggle-icon-wrapper'>
                    <img id='display-toggle-icon' src={SwitchIcon} onClick={onClickToggleButton} alt='Toggle icon'/>
                </div>
            </main> 
        )
    else
        return (
            <main id='content-wrapper'>
                <InputArea/>
                <OutputArea/>
            </main>
        )
}

function InputArea (props) {

    const { dispatch } = useContext(TokenizerContext);
    const defaultText = props.defaultText;
    const placeholder = `Enter your text here.\n\nThe corresponding tokens are generated in the output field, and you can copy the token text by clicking or tapping on it.\n\nYou can select how to split the original input into tokens: by whitespaces or lines`;
    const onInput = () => {
        const value = (document.getElementById
            ('input-area') as HTMLInputElement).value;
        dispatch({type: ACTION.INPUT.UPDATE, value});
    }
    const onClickClearButton = () => {
        (document.getElementById
            ('input-area') as HTMLInputElement).value = '';
        dispatch({type: ACTION.INPUT.CLEAR});
    }

    return (
        <div id='input-area-wrapper'>
            <div id='clear-btn-container'>
                <img id='clear-button' src={ClearIcon} onClick={onClickClearButton} alt='Clear icon'/>
            </div>
            <p id='input-area__header'>Input</p>
            <textarea id='input-area' 
                onInput={onInput}
                placeholder={placeholder}
                defaultValue={defaultText}>
            </textarea>
        </div>
    )
}

function OutputArea (props) {
    const isMobile = props.isMobile || false;
    const { state } = useContext(TokenizerContext);
    const { input, processType, removedChars, colorToken } = state;
    let config: TokenConfig = {
        processType,
        removedChars,
        colorToken
    }

    return (
        <div id='output-area-wrapper'>
            { isMobile && (
                <div id='output-area__mode-setting-wrapper'>
                    <ModeSetting isMobile={true}/>
                </div>
            )}
            <p id='output-area__header'>Output</p>
            <div id='output-area'>
                    { linesToElements(input, config) }
            </div>
        </div> 
    )
}