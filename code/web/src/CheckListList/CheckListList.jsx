import React from "react";
import { Link, Redirect } from 'react-router-dom';

import CheckListListItem from './CheckListListItem';
import Title from '../common/components/Title';
import { ActionButton } from './Buttons'
import { Context as CheckListsContext } from '../contexts/CheckListsContext';
import { Context as CheckListRunContext } from '../contexts/CheckListRunContext';


export default function CheckListList(props) {
  const [redirectToRun, setRedirectToRun] = React.useState({ redirect: false, to: null })
  const { state: { checkLists }, fetchCheckLists, deleteChecklist } = React.useContext(CheckListsContext)
  const { state: checklistRun, createChecklistRun } = React.useContext(CheckListRunContext)

  React.useEffect(() => {
    console.log('Useeffect runs')
    fetchCheckLists();
  }, [])

  async function onRunClick(checklist) {
    const {
      latest_run: latestRun,
      is_latest_run_complete: isLatestRunComplete
    } = checklist;

    let runPk = null
    if (latestRun && !isLatestRunComplete) {
      console.log('yes latest run')
      console.log(latestRun)
      const parts = latestRun.split('/')
      console.log(parts, parts[parts.length - 2])
      runPk = parts[parts.length - 2]
    } else {
      console.log('no latest run')
      const response = await createChecklistRun(checklist);
      runPk = response.data.pk;
    }
    console.log('runPk', runPk)
    setRedirectToRun({ redirect: true, to: `/checklist-runs/${runPk}/` })
  }

  async function onDeleteClick(checklist) {
    await deleteChecklist(checklist.url)
    fetchCheckLists()
  }

  if (checkLists === null) {
    return <h1>Loading...</h1>
  }

  if (redirectToRun.redirect) {
    return <Redirect to={redirectToRun.to} />
  }

  return (
    <div className="View CheckListListView" >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Title>
          Your checklists
        </Title>
        {checkLists.length > 0 && (
          <Link to="/checklists/new/">
            <ActionButton>Add</ActionButton>
          </Link>
        )}
      </div>
      {checkLists.length > 0 ? (
        <ul className="CheckListList">
          {checkLists && checkLists.map(checkList => (
            <CheckListListItem
              key={checkList.pk}
              checkList={checkList}
              onRunClick={onRunClick}
              onDeleteClick={onDeleteClick}
            />
          ))}
        </ul>
      ) : (
          <>
            <h3>You have no checklists added yet. Add you first one now!</h3>
            <Link to="/checklists/new/">
              <ActionButton>Add</ActionButton>
            </Link>
          </>
        )}
    </div >
  )
}