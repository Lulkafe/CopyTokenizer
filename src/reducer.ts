import { useContext } from "react"

export let ConverterContext = useContext(undefined);

const INIT_STATE = {
    input: ''
}

const ACTION = {
    INPUT: {
        UPDATE: 'User inputs text'
    }
}

const reducer = ({ action, state }) => {

    switch (action) {
        case ACTION.INPUT:
            //TODO: parse user text and convert it an array of words
            return state;

    }

    return state;
}