import React from "react";



export default function CheckListTitle(props) {
  return (
    <h1
      className={`CheckListTitle ${props.className ? props.className : ''}`}
    >
      {props.children}
    </h1>
  )
}