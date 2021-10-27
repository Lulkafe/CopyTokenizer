import React from "react";
import { Process } from './enum'; 
import { useState } from "react";

export function textToLines (text: string): string[] {
    return text.trim().split('\n');
}

export function linesToElements (lines: string[], process: Process, removedChars: string) {
    
    let elements = null;

    if (process === Process.perLine)
        elements = getLineTokens(lines, removedChars);
    
    if (process === Process.perWord)
        elements = getWordTokens(lines, removedChars);

    return elements;
}

function getLineTokens (lines: string[], removedChars: string = '') {
    const tokenClass = 'output-area__token';
    const generateToken = (line,idx) => 
        <ClickableToken 
            text={line}
            tokenClass={tokenClass}
            key={`token-${idx}`}/>

    return (
        <div>
            {lines.map((line, i) => {
                line = preprocessLine(line, removedChars);
                return (
                    <p key={`sentence-${i}`}>
                        { line !== '' && generateToken(line, i)}
                    </p>)
            })}
        </div>)
}

function getWordTokens (lines: string[], removeChars: string = '') {
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const createToken = (word) => 
        <ClickableToken 
            text={word}
            key={`token-${keySuffix()}`}
            tokenClass={tokenClass}/>

    return (
        <div>
            {lines.map((line, i) => {
                const words = preprocessWords(line, removeChars);
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


function preprocessWords (line: string, removedLetters: string = '') {
    if (removedLetters) 
        line = replaceCharsWithSpace(line, removedLetters);

    return line.trim().split(' ').filter(v => v);
}

function preprocessLine (line: string, removedLetters: string = '') {
    if (removedLetters) 
        line = replaceCharsWithSpace(line, removedLetters)
    
    return line;
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
	let { text, tokenClass } = props;
	const [clicked, setClicked] = useState(false);
    const highlighted = ' output-area__token__highlighted';
	const onClick = (e) => {
        const textContent = e.target.textContent;
        if (textContent)
            navigator.clipboard.writeText(textContent);

        setClicked(!clicked);
    }

    if (clicked)
        tokenClass += highlighted;

	return (
		<span 
			className={tokenClass}
			onClick={onClick}>
		    {text}
		</span>
	)
}