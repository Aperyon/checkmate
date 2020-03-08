import React from 'react';
import { Checkbox as SUICheckbox } from 'semantic-ui-react'


export default function ArchiveRunsToggle({ showArchiveds, setShowArchiveds }) {
  return (
    <div className="ToggleContainer">
      <label>
        Show archives
      </label>
      <SUICheckbox
        toggle
        checked={showArchiveds}
        onChange={(elem, event) => { setShowArchiveds(!showArchiveds) }}
      />
    </div>
  )
}