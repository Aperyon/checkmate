import React from 'react';
import { Link } from 'react-router-dom';


export default function ChecklistRunList({ checklistRuns }) {
  return <div className="ChecklistRunList" />;

  if (checklistRuns === null) {
    return (
      <div className="ChecklistRunList">
        Loading...
      </div>
    )
  }
  return (
    <div className="ChecklistRunList">
      <h3>Runs</h3>
      <ul>
        {checklistRuns.map(checklistRun => <ChecklistRunItem checklistRun={checklistRun} key={checklistRun.url} />)}
      </ul>
    </div>
  )
}


function ChecklistRunItem({ checklistRun }) {
  return (
    <Link to={`/checklist-runs/${checklistRun.pk}`}>
      <li>{checklistRun.title}</li>
    </Link>
  )
}