import React from 'react';

import { Button } from '../components/Buttons';
import Icon from '../components/Icon'

function renderField(name, register, placeholder, onChange, className, type, error) {
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
  }
  return (
    <input
      placeholder={placeholder}
      name={name}
      ref={register()}
      onChange={onChange}
      type={type || 'input'}
      className={`${error ? 'Error' : ''} ${className ? className : ''}`}
    />
  )
}


export function InputGroup({ label, name, register, placeholder, onChange, error, className, type }) {
  return (
    <div className="InputGroup">
      {label && <label className={`${error ? 'Error' : ''}`}>{label}</label>}
      {renderField(name, register, placeholder, onChange, className, type, error)}
      {error && <p className="Error">{error}</p>}
    </div>
  )
}

export function FieldArrayInputGroup({ label, name, register, placeholder, onChange, error, className, type, remove }) {
  return (
    <div className="InputGroup FieldArrayInputGroup">
      <div className="InputBlock">
        <Button className="Small" onClick={remove} type="button">
          <Icon icon="times" className="NoMargin" />
        </Button>
        {label && (<label className={`${error ? 'Error' : ''}`}>{label}</label>)}
        {renderField(name, register, placeholder, onChange, className, type, error)}
      </div>
      {error && <p className="Error">{error}</p>}
    </div>
  )
}