import React from "react";

import { Link } from 'react-router-dom';

import Icon from './Icon';


export function ViewButton() {
  return (
    <Button icon="eye" className="NoText" />
  )
}

export function RunButton({ onClick, shouldStartNewRun }) {
  return (
    <Button onClick={onClick}>
      <Icon icon="play" />
      Runs
      </Button>
  )
}

export function MiscButton() {
  return (
    <Button className="NoText" icon="ellipsis-v" />
  )
}

export function ActionButton(props) {
  return (
    <Button
      {...props}
      className={`ActionButton asd ${props.className || ''}`}
    >
      {props.children}
    </Button>
  )
}

export function Button(props) {
  return (
    <button
      {...props}
      className={`Button ${props.className ? props.className : ''}`}
      type={props.type || "button"}
      onClick={props.onClick || (() => { })}
    >
      {props.icon && <Icon icon={props.icon} />}
      {props.children}
    </button >
  )
}


export function InputButton(props) {
  return <Button {...props} />
}


export function BackButton(props) {
  return <Link to={props.to} className="BackButton">Go back</Link>
}


export function ButtonContainer(props) {
  return <div className="ButtonContainer" style={{ ...props.style }}>{props.children}</div>
}


export function NewChecklistButton(props) {
  return (
    <Link to="/checklists/new/">
      <ActionButton className="AddChecklistButton">
        <Icon icon="plus" />
        <span>Checklist</span>
      </ActionButton>
    </Link>
  )
}


export function ChecklistCloseButton(props) {
  return (
    <ActionButton onClick={props.onCloseClick}>
      <Icon icon="check" />
      Complete
    </ActionButton>
  )
}