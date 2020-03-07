import React from 'react';
import { Link } from 'react-router-dom';


export default function ChecklistRunList({ checklistRuns, activeChecklistRunId }) {
  // return <div className="ChecklistRunList" />;

  if (checklistRuns === null) {
    return (
      <div className="ChecklistRunList">
        Loading...
      </div>
    )
  }
  return (
    <div className="ChecklistRunList">
      <h3 className="Title">Runs</h3>
      <ul>
        {checklistRuns.map(checklistRun => (
          <ChecklistRunItem
            key={checklistRun.url}
            checklistRun={checklistRun}
            isActive={parseInt(activeChecklistRunId, 10) === checklistRun.pk}
          />
        ))}
      </ul>
    </div>
  )
}


function ChecklistRunItem({ checklistRun, isActive }) {
  let content = checklistRun.title;
  if (checklistRun.name) {
    content = `${checklistRun.title} - ${checklistRun.name}`
  }
  return (
    <Link to={`/checklist-runs/${checklistRun.pk}`}>
      <li className={`${isActive ? 'Active' : ''}`}>{content}</li>
    </Link>
  )
}