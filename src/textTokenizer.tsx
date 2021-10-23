import React from "react";
import { Process } from './enum'; 

export function textToArray (text: string): string[] {
    return text.trim().split('\n');
}

export function arrayToElements (array: string[], process: Process) {
    
    if (process === Process.perLine)
        return toLineElements(array);
    
    if (process === Process.perWord)
        return toWordElements(array);

    return null;
}

function toLineElements (lines: string[]) {
    
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const onClick = (e) => {
        const text = e.target.textContent;
        if (text)
            navigator.clipboard.writeText(text);
    }
    
    return (
        <div>
            {lines.map((line, i) => 
                <p key={`sentence-${keySuffix()}`}>
                    <span className={tokenClass}
                        key={`token-${keySuffix()}`} 
                        onClick={onClick}>{line}
                    </span>
                </p>)}
        </div>
    )
}

function toWordElements (lines: string[]) {

    const tokenClass = 'output-area__token';
    
    return (
        <div>
            {lines.map(line => {
                const words = line.trim().split(' ').filter(v => v);
                return (
                    <p>
                        {words.map(word => 
                            <span className={tokenClass}>{word}</span>)}
                    </p>
                )
            })}
        </div>
    )
}
