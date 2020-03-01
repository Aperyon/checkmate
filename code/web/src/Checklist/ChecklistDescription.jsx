import React from "react";


export default function ChecklistDescription(props) {
  return (
    <h2 className={`ChecklistDescription ${props.small ? 'Small' : ''}`}>{props.children}</h2>
  )
}