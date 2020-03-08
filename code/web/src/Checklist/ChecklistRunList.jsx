import React from 'react';
import { Link } from 'react-router-dom';
import { TitleContainer } from '../common/components/View';
import { Title } from '../common/components/Title';
import ArchiveRunsToggle from './ArchiveRunsToggle';


export default function ChecklistRunList({ checklistRuns, activeChecklistRunId, ...props }) {
  // return null
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
      <TitleContainer>
        <Title>Runs</Title>
        <ArchiveRunsToggle
          showArchiveds={props.showArchiveds}
          setShowArchiveds={props.setShowArchiveds}
        />
      </TitleContainer>
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
    content = checklistRun.name
  }
  return (
    <Link to={`/checklist-runs/${checklistRun.pk}`}>
      <li className={`${isActive ? 'Active' : ''}`}>{content}</li>
    </Link>
  )
}