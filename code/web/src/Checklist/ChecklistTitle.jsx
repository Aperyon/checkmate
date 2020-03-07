import React from "react";



export default function ChecklistTitle(props) {
  return (
    <h1
      className={
        `Title ${props.className ? props.className : ''} ${props.small ? 'Small' : ''}`}
    >
      {props.children}
    </h1>
  )
}