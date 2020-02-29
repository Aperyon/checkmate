import React from "react";
import { Link, Redirect } from 'react-router-dom';

import ChecklistListItem from './ChecklistListItem';
import Onboarding from './Onboarding';
import Title from '../common/components/Title';
import { ActionButton } from '../common/components/Buttons'
import Icon from '../common/components/Icon'
import { Context as ChecklistsContext } from '../contexts/ChecklistsContext';
import { Context as ChecklistRunContext } from '../contexts/ChecklistRunContext';



function shouldStartNewRun(checklist) {
  const {
    latest_run: latestRun,
    is_latest_run_complete: isLatestRunComplete
  } = checklist;

  return !latestRun || (latestRun && isLatestRunComplete);
}


export default function ChecklistList(props) {
  const [redirectToRun, setRedirectToRun] = React.useState({ redirect: false, to: null })
  const { state: { checklists }, fetchChecklists, deleteChecklist } = React.useContext(ChecklistsContext)
  const { state: checklistRun, createChecklistRun } = React.useContext(ChecklistRunContext)

  React.useEffect(() => {
    fetchChecklists();
  }, [])

  async function onRunClick(checklist) {
    const {
      latest_run: latestRun,
      is_latest_run_complete: isLatestRunComplete
    } = checklist;

    let runPk = null
    if (shouldStartNewRun(checklist)) {
      const response = await createChecklistRun(checklist);
      runPk = response.data.pk;
    } else {
      const parts = latestRun.split('/')
      runPk = parts[parts.length - 2]
    }
    setRedirectToRun({ redirect: true, to: `/checklist-runs/${runPk}/` })
  }

  async function onDeleteClick(checklist) {
    const isConfirmed = window.confirm("Are you sure you want to delete this checklist?")
    if (isConfirmed) {
      await deleteChecklist(checklist.url)
      fetchChecklists()
    }
  }

  if (checklists === null) {
    return <h1>Loading...</h1>
  }

  if (redirectToRun.redirect) {
    return <Redirect to={redirectToRun.to} />
  }

  return (
    <div className="View ChecklistListView" >
      <div className="TitleContainer">
        <Title>
          Your checklists
        </Title>
        {checklists.length > 0 && (
          <Link to="/checklists/new/">
            <ActionButton>
              <Icon icon="plus" />
              <span>Add new checklist</span>
            </ActionButton>
          </Link>
        )}
      </div>
      {checklists.length > 0 ? (
        <ul className="ChecklistList">
          {checklists && checklists.map(checklist => (
            <ChecklistListItem
              key={checklist.pk}
              checklist={checklist}
              onRunClick={onRunClick}
              onDeleteClick={onDeleteClick}
              shouldStartNewRun={shouldStartNewRun(checklist)}
            />
          ))}
        </ul>
      ) : (
          <Onboarding />
        )}
    </div >
  )
}