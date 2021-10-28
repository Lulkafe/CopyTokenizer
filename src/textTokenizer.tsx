import React from "react";
import { Process } from './enum'; 
import { useState } from "react";
import { TokenConfig } from "./reducer";

export function textToLines (text: string): string[] {
    return text.trim().split('\n');
}

export function linesToElements (lines: string[], config: TokenConfig) {
    const process = config.processType;
    let elements = null;

    console.log(config)

    if (process === Process.perLine)
        elements = generateLineTokens(lines, config);
    
    if (process === Process.perWord)
        elements = generateWordTokens(lines, config);

    return elements;
}

function generateLineTokens (lines: string[], config: TokenConfig) {
    const tokenClass = 'output-area__token';
    const { removedChars, clickedTokenColor } = config;   
    const generateToken = (line,idx) => 
        <ClickableToken 
            text={line}
            tokenClass={tokenClass}
            highlightColor={clickedTokenColor}
            key={`token-${idx}`}/>

    return (
        <div>
            {lines.map((line, i) => {
                if (removedChars) 
                line = replaceCharsWithSpace(line, removedChars)
                return (
                    <p key={`sentence-${i}`}>
                        { line !== '' && generateToken(line, i)}
                    </p>)
            })}
        </div>)
}

function generateWordTokens (lines: string[], config: TokenConfig) {
    const tokenClass = 'output-area__token';
    const { removedChars, clickedTokenColor } = config;
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const createToken = (word) => 
        <ClickableToken 
            text={word}
            key={`token-${keySuffix()}`}
            highlightColor={clickedTokenColor}
            tokenClass={tokenClass}/>
    return (
        <div>
            {lines.map((line, i) => {
                if (removedChars)
                    line = replaceCharsWithSpace(line, removedChars); 

                const words = line.trim().split(' ').filter(v => v)
                return (
                    <p key={`line-${i}`}>
                        {words.map(word => 
                            word !== '' && createToken(word)
                        )}
                    </p>
                )
            })}
        </div>)
}

function replaceCharsWithSpace (line: string, removedLetters: string) {
    
    const escapedChars = ['.','^','$','*','+','-','?','(',')',
                          '[',']','{','}','|', '//','—','/'];
    const rgxsForEscaped = [/\./g, /\^/g, /\$/g, /\*/g, /\+/g, 
                            /\-/g, /\?/g, /\(/g, /\)/g, /\[/g, 
                            /\]/g, /\{/g, /\}/g, /\|/g, /\\/g, 
                            /\—/g, /\//g];
    
    for (let i = 0; i < removedLetters.length; i++) {
        let c = removedLetters[i];
        let re: RegExp = null;
        let idx = escapedChars.indexOf(c);

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


function ClickableToken (props) {
	let { text, tokenClass, highlightColor } = props;
	const [clicked, setClicked] = useState(false);
    const highlighted = ' output-area__token__highlighted';
	const onClick = (e) => {
        const textContent = e.target.textContent;
        if (textContent)
            navigator.clipboard.writeText(textContent);

        setClicked(!clicked);
    }


	return (
		<span 
			className={tokenClass}
			onClick={onClick}
            style={{ background: clicked? highlightColor : 'white' }}>
		    {text}
		</span>
	)
}