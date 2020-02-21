import React from "react";


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
            />
            {item.text}
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