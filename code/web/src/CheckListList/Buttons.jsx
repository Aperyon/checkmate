import React from "react";


export function ViewButton() {
  return (
    <Button icon="eye">View</Button>
  )
}

export function RunButton({ onClick }) {
  return (
    <Button onClick={onClick} icon="play">Run</Button>
  )
}

export function MiscButton() {
  return (
    <Button icon="hamburger-dots" />
  )
}

export function ActionButton(props) {
  return <Button {...props}>{props.children}</Button>
}

export function Button(props) {
  return (
    <button className="Button" type={props.type || "button"} onClick={props.onClick || (() => { })}>
      {props.icon && <i className={`Icon fa fa-${props.icon}`} />}
      {props.children}
    </button >
  )
}