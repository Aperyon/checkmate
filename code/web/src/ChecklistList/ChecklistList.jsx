import React from 'react';

import * as u from './utils';
import ChecklistListItem from './ChecklistListItem';


export default function ChecklistList({ checklists, onRunClick, onDeleteClick }) {
  return (
    <ul className="ChecklistList">
      {checklists.map(checklist => (
        <ChecklistListItem
          key={checklist.pk}
          checklist={checklist}
          onRunClick={onRunClick}
          onDeleteClick={onDeleteClick}
          shouldStartNewRun={u.shouldStartNewRun(checklist)}
        />
      ))}
    </ul>
  )
}