import React from 'react';

const style = {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#1da57a",
    cursor: "pointer"
}

export default function LinkButton(props) {
    return <button {...props} style={style}></button>
}
