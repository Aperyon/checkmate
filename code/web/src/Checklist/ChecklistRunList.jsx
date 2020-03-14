import React from 'react';
import { Link } from 'react-router-dom';
import { TitleContainer } from '../common/components/View';
import { Title } from '../common/components/Title';
import ArchiveRunsToggle from './ArchiveRunsToggle';
import { Text } from '../common/components/Texts'
import { ButtonContainer, Button } from '../common/components/Buttons'
import Icon from '../common/components/Icon';


export default function ChecklistRunList({ checklistRuns, activeChecklistRunId, ...props }) {
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
  const checkedItemCount = checklistRun.items.filter(item => item.is_checked).length
  const itemCount = checklistRun.items.length;

  return (
    <Link to={`/checklist-runs/${checklistRun.pk}`}>
      <li className={`${isActive ? 'Active' : ''}`}>
        <Text>{checklistRun.title} <span>{`(${checkedItemCount}/${itemCount})`}</span></Text>
        <ButtonContainer>
          <Button className={`NoText ${checklistRun.is_archived ? "Active" : ""}`}>
            <Icon icon="archive" />
          </Button>
          {/* <Button className="NoText">
            <Icon icon="trash" />
          </Button> */}
        </ButtonContainer>
      </li>
    </Link>
  )
}