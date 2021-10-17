//User text => Array of token (word/line)
export function textTokenizer (text: string): string[] {
    return [];
}

function toWordArray (text: string): string[] {
    let processed_text = text.split(' ');
    return processed_text;
}

function toLineArray (text: string): string[] {
    let processed_text = text.split('\n').map(line => line + '\n');
    return processed_text;
}