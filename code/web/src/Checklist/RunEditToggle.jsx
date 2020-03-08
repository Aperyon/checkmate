import React from 'react';
import { Checkbox as SUICheckbox, Popup } from 'semantic-ui-react'


export default function RunEditToggle({ editMode, setEditMode }) {
  return (
    <div className="RunEditToggle">
      <label>
        {editMode ? 'Edit mode' : 'Run mode'}
        <Popup
          content='Edit the current Run'
          trigger={<i className="fa fa-info-circle" style={{ marginLeft: "10px" }} />}
          position="top center"
        />
      </label>
      <SUICheckbox
        toggle
        checked={editMode}
        onChange={(elem, event) => { setEditMode(event.checked) }}
      />
    </div>
  )
}