import React from "react";


export default function ChecklistItems(props) {
  return (
    <ul className="ChecklistItems">{props.children}</ul>
  )
}