import React from "react";
import { Process } from './enum'; 
import { useState } from "react";

export function textToLines (text: string): string[] {
    return text.trim().split('\n');
}

export function linesToElements (lines: string[], process: Process) {
    
    let elements = null;

    if (process === Process.perLine)
        elements = getLineTokens(lines);
    
    if (process === Process.perWord)
        elements = getWordTokens(lines);

    return elements;
}

function getLineTokens (lines: string[]) {
    const tokenClass = 'output-area__token';
    const generateToken = (line,idx) => 
        <ClickableToken 
            text={line}
            tokenClass={tokenClass}
            keyValue={`token-${idx}`}/>
        

    return (
        <div>
            {lines.map((line, i) => 
                <p key={`sentence-${i}`}>
                    { line !== '' && generateToken(line, i)}
                </p>)}
        </div>)
}

function getWordTokens (lines: string[], removeLetters: string = '') {
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const createToken = (word) => 
        <ClickableToken 
            text={word}
            tokenClass={tokenClass}
            keyValue={`token-${keySuffix()}`}/>

    return (
        <div>
            {lines.map(line => {
                const words = processWords(line, removeLetters);
                return (
                    <p key={`line-${keySuffix()}`}>
                        {words.map(word => 
                            word !== '' && createToken(word)
                        )}
                    </p>
                )
            })}
        </div>)
}


function processWords (line: string, removeLetters: string = null) {
    //TODO: make this function work for line (spec change)

    //e.g. ,)_* 
    if (removeLetters) {
        for (let i = 0; i < removeLetters.length; i++) {
            const c = removeLetters[i];
            const re = new RegExp(c, 'g');
            line = line.replace(re, ' ');
        }
    }

    return line.trim().split(' ').filter(v => v);
}


function ClickableToken (props) {
	let { text, tokenClass, keyValue } = props;
	const [clicked, setClicked] = useState(false);
    const highlighted = ' output-area__token__highlighted';
	const onClick = (e) => {
        const text = e.target.textContent;
        if (text)
            navigator.clipboard.writeText(text);

        setClicked(!clicked);
    }

    if (clicked)
        tokenClass += highlighted;

	return (
		<span 
			className={tokenClass}
			key={keyValue}
			onClick={onClick}>
		    {text}
		</span>
	)
}