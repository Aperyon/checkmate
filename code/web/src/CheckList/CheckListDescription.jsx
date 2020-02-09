import React from "react";


export default function CheckListDescription(props) {
  return (
    <h2 className={`CheckListDescription ${props.small ? 'Small' : ''}`}>{props.children}</h2>
  )
}