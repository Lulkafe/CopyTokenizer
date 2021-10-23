import React from "react";
import { Process } from './enum'; 

export function textToLines (text: string): string[] {
    return text.trim().split('\n');
}

export function linesToElements (lines: string[], process: Process) {
    
    let elements = null;
    const tokenClass = 'output-area__token';
    const keySuffix = ((v = 0) => () => v += 1)(); 
    const onClick = (e) => {
        const text = e.target.textContent;
        console.log(text);
        if (text)
            navigator.clipboard.writeText(text);
    }

    if (process === Process.perLine)
        elements = (
        <div>
            {lines.map((line, i) => 
                <p key={`sentence-${keySuffix()}`}>
                    <span className={tokenClass}
                        key={`token-${keySuffix()}`} 
                        onClick={onClick}>{line}
                    </span>
                </p>)}
        </div>)
    
    if (process === Process.perWord)
        elements = (
        <div>
            {lines.map(line => {
                const words = line.trim().split(' ').filter(v => v);
                return (
                    <p key={`sentence-${keySuffix()}`}>
                        {words.map(word => 
                        <span 
                            key={`token-${keySuffix()}`} 
                            className={tokenClass}
                            onClick={onClick}>
                            {word}
                        </span>)}
                    </p>
                )
            })}
        </div>)

    return elements;
}

