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
    const generateToken = (line,idx) => {
        return (
            <ClickableToken 
                text={line}
                tokenClass={tokenClass}
                keyValue={`token-${idx}`}/>
        )
    }

    return (
        <div>
            {lines.map((line, i) => 
                <p key={`sentence-${i}`}>
                    { line !== '' && generateToken(line, i)}
                </p>)}
        </div>)
}

function getWordTokens (lines: string[]) {
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const generateToken = (word) => {
        return (
            <ClickableToken 
                text={word}
                tokenClass={tokenClass}
                keyValue={`token-${keySuffix()}`}/>
        )
    }

    return (
        <div>
            {lines.map(line => {
                const words = line.trim().split(' ').filter(v => v);
                return (
                    <p key={`sentence-${keySuffix()}`}>
                        {words.map(word => 
                            word !== '' && generateToken(word)
                        )}
                    </p>
                )
            })}
        </div>)
}


function ClickableToken (props) {
	let { text, tokenClass, keyValue } = props;
	const [clicked, setClicked] = useState(false);
    const additional = ' output-area__token__highlighted';
	const onClick = (e) => {
        const text = e.target.textContent;
        if (text)
            navigator.clipboard.writeText(text);

        setClicked(!clicked);
    }

    if (clicked)
        tokenClass += additional;

	return (
		<span 
			className={tokenClass}
			key={keyValue}
			onClick={onClick}>
		{text}
		</span>
	)
}