import React from "react";

import { Link } from 'react-router-dom';

import Icon from '../common/components/Icon';


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
    <Button className="NoText" icon="ellipsis-v" />
  )
}

export function ActionButton(props) {
  return <Button {...props}>{props.children}</Button>
}

export function Button(props) {
  return (
    <button
      className={`Button ${props.className ? props.className : ''}`}
      type={props.type || "button"}
      onClick={props.onClick || (() => { })}
    >
      {props.icon && <Icon icon={props.icon} />}
      {props.children}
    </button >
  )
}


export function BackButton(props) {
  return <Link to={props.to} className="BackButton">{props.children}</Link>
}