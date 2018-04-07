import React from 'react'
import './Button.css'

export default props => (<button className="Button" onClick={props.onClick}>
{props.label}
</button>)