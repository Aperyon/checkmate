import React from "react";



export default function CheckListTitle(props) {
  return (
    <h1
      className={
        `CheckListTitle ${props.className ? props.className : ''} ${props.small ? 'Small' : ''}`}
    >
      {props.children}
    </h1>
  )
}