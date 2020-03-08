import React from "react";


export default function ChecklistDescription(props) {
  return (
    <p className={`${props.small ? 'Small' : ''}`}>{props.children}</p>
  )
}