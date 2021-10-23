import React from "react";
import { Component } from "react";

//User text => Array of token (word/line)
export function textToArray (text: string): string[] {
    return [];
}

export function arrayToElements (array: string[]) {
  
}

function toWordArray (text: string): string[] {
    let processed_text = text.split(' ');
    return processed_text;
}

function toLineArray (text: string): string[] {
    let processed_text = text.split('\n').map(line => line + '\n');
    return processed_text;
}