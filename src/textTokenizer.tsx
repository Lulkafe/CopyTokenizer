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

    return (
        <div>
            {lines.map((line, i) => 
                <p key={`sentence-${i}`}>
                    <ClickableToken 
                        text={line}
                        tokenClass={tokenClass}
                        keyValue={`token-${i}`}/>
                </p>)}
        </div>)
}

function getWordTokens (lines: string[]) {
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 

    return (
        <div>
            {lines.map(line => {
                const words = line.trim().split(' ').filter(v => v);
                return (
                    <p key={`sentence-${keySuffix()}`}>
                        {words.map(word => 
                        <ClickableToken 
                            text={word}
                            tokenClass={tokenClass}
                            keyValue={`token-${keySuffix()}`}/>)}
                    </p>
                )
            })}
        </div>)
}


function ClickableToken (props) {
	const { text, tokenClass, keyValue } = props;
	const [clicked, setClicked] = useState(false);
	const onClick = (e) => {
        const text = e.target.textContent;
        if (text)
            navigator.clipboard.writeText(text);

        setClicked(!clicked);
    }

	return (
		<span 
			className={tokenClass}
			key={keyValue}
			onClick={onClick}>
		{text}
		</span>
	)
}