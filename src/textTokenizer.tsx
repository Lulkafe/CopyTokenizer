import React from "react";
import { useState } from "react";
import { TokenConfig } from "./reducer";
import { ReactElement } from "react";

export function textToLines (text: string): string[] {
    return text.trim().split('\n');
}

export function linesToElements (lines: string[], config: TokenConfig): ReactElement {
    const elements = config.splitBySpace? 
        generateWordTokens(lines, config): generateLineTokens(lines, config);

    return elements;
}

function generateLineTokens (lines: string[], config: TokenConfig): ReactElement {
    const tokenClass = 'token';
    const { removedChars } = config;   
    const generateToken = (line,idx) => 
        <ClickableToken 
            text={line}
            tokenClass={tokenClass}
            config={config}
            key={`token-${idx}`}/>

    return (
        <div>
            {lines.map((line, i) => {
                if (removedChars) 
                line = replaceCharsWithSpace(line, removedChars)
                return (
                    <p className='output-area__paragraph' key={`sentence-${i}`}>
                        { line !== '' && generateToken(line, i)}
                    </p>)
            })}
        </div>)
}

function generateWordTokens (lines: string[], config: TokenConfig): ReactElement {
    const tokenClass = 'token';
    const { removedChars } = config;
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const createToken = (word) => 
        <ClickableToken 
            text={word}
            key={`token-${keySuffix()}`}
            config={config}
            tokenClass={tokenClass}/>
    return (
        <div>
            {lines.map((line, i) => {
                if (removedChars)
                    line = replaceCharsWithSpace(line, removedChars); 

                const words = line.trim().split(/ |\t/).filter(v => v)
                return (
                    <p className='output-area__paragraph' key={`line-${i}`}>
                        {words.map(word => 
                            word !== '' && createToken(word)
                        )}
                    </p>
                )
            })}
        </div>)
}

function replaceCharsWithSpace (line: string, removedChars: string): string {
    
    const escapedChars = ['.','^','$','*','+','-','?','(',')',
                          '[',']','{','}','|', '//','—','/'];
    const rgxsForEscaped = [/\./g, /\^/g, /\$/g, /\*/g, /\+/g, 
                            /\-/g, /\?/g, /\(/g, /\)/g, /\[/g, 
                            /\]/g, /\{/g, /\}/g, /\|/g, /\\/g, 
                            /\—/g, /\//g];
    
    for (let i = 0; i < removedChars.length; i++) {
        const c = removedChars[i];
        const idx = escapedChars.indexOf(c);
        let re: RegExp = null;

        try {
            if (idx === -1) 
                re = new RegExp(c, 'g');
            else
                re = rgxsForEscaped[idx];
            
            line = line.replace(re, ' ');
        } catch (e) {
            console.error(e);
            throw new Error(e.message);
        }
    }

    return line;
}


function ClickableToken (props): ReactElement {
	let { text, tokenClass, config } = props;
    const { colorToken } = config;
    const [clickedToggle, setClickedToggle] = useState(false);
    const onClick = (e) => {
        const textContent = e.target.textContent;
        if (textContent)
            navigator.clipboard.writeText(textContent);

        if (colorToken)
            setClickedToggle(!clickedToggle);
    };

    if (colorToken && clickedToggle) 
        tokenClass += ' token--grayout'
   
	return (
		<span 
			className={tokenClass}
			onClick={onClick}>
		    {text}
		</span>
	)
}
