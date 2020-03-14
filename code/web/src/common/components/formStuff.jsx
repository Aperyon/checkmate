import React from 'react';

import { Button, InputButton } from '../components/Buttons';
import Icon from '../components/Icon'
import { ReactComponent as CheckedCheckboxSVG } from '../../assets/Checked-Checkbox-Frame-Transparent.svg';
import { ReactComponent as UncheckedCheckboxSVG } from '../../assets/Unchecked-Checkbox-Frame-Transparent.svg';

function renderField(name, register, placeholder, onChange, className, type, error, withButton, buttonText, onClick, autoFocus) {
  if (type === 'textarea') {
    return (
      <textarea
        placeholder={placeholder}
        name={name}
        ref={register()}
        onChange={onChange}
        className={`${error ? 'Error' : ''} ${className ? className : ''}`}
      />
    )
  } else if (withButton) {
    return (
      <div className="InputWithButton">
        <input
          autoFocus={autoFocus}
          placeholder={placeholder}
          name={name}
          ref={register()}
          onChange={onChange}
          type={type || 'input'}
          className={`${error ? 'Error' : ''} ${className ? className : ''}`}
        />
        <InputButton onClick={onClick}>{buttonText}</InputButton>
      </div>
    )
  }
  return (
    <input
      autoFocus={autoFocus}
      placeholder={placeholder}
      name={name}
      ref={register()}
      onChange={onChange}
      type={type || 'input'}
      className={`${error ? 'Error' : ''} ${className ? className : ''}`}
    />
  )
}


export function InputGroup({ label, name, register, placeholder, onChange, error, className, type, inline, withButton, buttonText, onClick, autoFocus, labelClass }) {
  return (
    <div className="InputGroup">
      <div className={`${inline ? 'Inline' : ''}`}>
        {renderField(name, register, placeholder, onChange, className, type, error, withButton, buttonText, onClick, autoFocus)}
        {label && <label className={`FloatingLabel ${error ? 'Error' : ''} ${labelClass ? labelClass : ""}`}>{label}</label>}
      </div>
      {error && <p className="Error">{error}</p>}
    </div>
  )
}

export function FieldArrayInputGroup({ label, name, register, placeholder, onChange, error, className, type, remove, isRemoveButtonDisabled }) {
  className += ' TitleFont'
  return (
    <div className="InputGroup FieldArrayInputGroup">
      <div className="InputBlock">
        <Button
          className="Small NoBorder"
          onClick={remove}
          type="button"
          tabIndex="-1"
          disabled={isRemoveButtonDisabled}
        >
          <Icon icon="times" className="NoMargin" />
        </Button>
        {label && (<label className={`${error ? 'Error' : ''}`}>{label}</label>)}
        {renderField(name, register, placeholder, onChange, className, type, error)}
      </div>
      {error && <p className="Error">{error}</p>}
    </div>
  )
}

export function Checkbox({ isChecked }) {
  return (
    <div className="CheckboxContainer">
      {isChecked ? (
        <CheckedCheckboxSVG
          className="Checkbox Checked"
        />
      ) : (
          <UncheckedCheckboxSVG
            className="Checkbox"
          />
        )}
    </div>
  )
}
