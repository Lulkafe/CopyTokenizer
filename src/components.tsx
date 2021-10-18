import React from "react";

export default function App () {
    return (
        <div>
            <Header />
            <Content>
                <InputArea />
                <OutputArea />
            </Content>
        </div>
    )
}

function Header () {

    return (
        <nav>
            <div id='nav__content-wrapper'>

            </div>
        </nav>
    )
}

function Content (props) {
    return (
        <div id='content__wrapper'>
            {props.children}
        </div>
    )
}

function InputArea () {
    return (
        <textarea id='input-area'></textarea>
    )
}

function OutputArea (props) {

    const { tokens } = props; 

    return (
        <div id='output-area'>

        </div>
    )
}