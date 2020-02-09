import React from "react";


export default function CheckListItem(props) {
  const { item } = props;
  console.log(props.runMode)
  if (props.runMode) {
    return (
      <li className="CheckListItem">
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
    <li className="CheckListItem">
      {item.text}
    </li>
  )
}