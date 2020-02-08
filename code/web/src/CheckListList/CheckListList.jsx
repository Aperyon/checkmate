import React from "react";
import { Link, Redirect } from 'react-router-dom';

import CheckListListItem from './CheckListListItem';
import Title from '../common/components/Title';
import { ActionButton } from './Buttons'
import { Context as CheckListsContext } from '../contexts/CheckListsContext';
import { Context as CheckListRunContext } from '../contexts/CheckListRunContext';


export default function CheckListList(props) {
  const [redirectToRun, setRedirectToRun] = React.useState({ redirect: false, to: null })
  const { state: { checkLists }, fetchCheckLists } = React.useContext(CheckListsContext)
  const { state: checklistRun, createChecklistRun } = React.useContext(CheckListRunContext)

  React.useEffect(() => {
    fetchCheckLists();
  }, [])

  async function onRunClick(checklist) {
    console.log('run clicked')
    const response = await createChecklistRun(checklist);
    setRedirectToRun({ redirect: true, to: `/checklist-runs/${response.data.pk}/` })
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
        <Link to="/checklists/new/">
          <ActionButton>Add</ActionButton>
        </Link>
      </div>
      <ul className="CheckListList">
        {checkLists && checkLists.map(checkList => (
          <CheckListListItem
            key={checkList.pk}
            checkList={checkList}
            onRunClick={onRunClick}
          />
        ))}
      </ul>
    </div >
  )
}