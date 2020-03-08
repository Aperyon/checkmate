import React from "react";

import { Checkbox } from '../common/components/formStuff';
import { Title } from '../common/components/Title';


export default function ChecklistItem(props) {
  const { item } = props;
  if (props.runMode) {
    return (
      <li className="ChecklistItem">
        {props.runMode && (
          <label>
            <input
              name={`items[${props.index}].is_checked`}
              type="checkbox"
              onChange={(e) => props.onCheckboxChange(e, item)}
              ref={props.register()}
              style={{ display: 'none' }}
            />
            <Checkbox isChecked={props.isChecked} />
            <input
              name={`items[${props.index}].text`}
              type="text"
              ref={props.register()}
            />
          </label>
        )}
      </li>
    )
  }
  return (
    <li className="ChecklistItem">
      {item.text}
    </li>
  )
}