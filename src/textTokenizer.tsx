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
    
    const tokenClass = 'output-token';
    
    return (
        <div>
            {lines.map(line => 
                <p><span className={tokenClass}>{line}</span></p>)}
        </div>
    )
}

function toWordElements (lines: string[]) {

    const tokenClass = 'output-token';
    
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
