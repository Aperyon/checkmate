import React from "react";

import { Checkbox } from '../common/components/formStuff';
import { Button } from '../common/components/Buttons';
import { Title } from '../common/components/Title';
import Icon from '../common/components/Icon';


export default function ChecklistItem({ item, editMode, ...props }) {
  if (editMode) {
    return <ChecklistItemEditMode {...props} item={item} />
  }
  return <ChecklistItemRunMode {...props} item={item} />
}


export function ChecklistItemEditMode({ item, ...props }) {
  return (
    <li className="ChecklistItem">
      <Button
        className="Small NoBorder"
        onClick={props.remove}
        type="button"
        tabIndex="-1"
        disabled={props.isRemoveButtonDisabled}
      >
        <Icon icon="times" className="NoMargin" />
      </Button>
      <input
        name={`items[${props.index}].text`}
        type="text"
        ref={props.register()}
        defaultValue={item.text}
        placeholder="Type new item"
        onChange={props.onChange}
        className="Title"
      />
      <input
        name={`items[${props.index}].is_checked`}
        type="hidden"
        ref={props.register()}
        defaultValue={item.is_checked || false}
      />
    </li>
  )
}


export function ChecklistItemRunMode({ item, ...props }) {
  return (
    <li className="ChecklistItem">
      <label>
        <input
          name={`items[${props.index}].is_checked`}
          type="checkbox"
          onChange={(e) => props.onCheckboxChange(e, item)}
          ref={props.register()}
          style={{ display: 'none' }}
        />
        <Checkbox isChecked={props.isChecked} />
        <Title>{item.text}</Title>
      </label>
    </li >
  )
}