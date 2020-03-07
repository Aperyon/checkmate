import React from "react";
import { Redirect } from 'react-router-dom';

import ChecklistList from './ChecklistList';
import Onboarding from './Onboarding';
import { View, TitleContainer } from '../common/components/View';
import { HeroTitle } from '../common/components/Title';
import { NewChecklistButton } from '../common/components/Buttons'
import { Context as ChecklistsContext } from '../contexts/ChecklistsContext';
import { Context as ChecklistRunContext } from '../contexts/ChecklistRunContext';
import * as u from './utils';


export default function ChecklistListView(props) {
  const [redirectToRun, setRedirectToRun] = React.useState({ redirect: false, to: null })
  const { state: { checklists }, fetchChecklists, deleteChecklist } = React.useContext(ChecklistsContext)
  const { createChecklistRun } = React.useContext(ChecklistRunContext)

  React.useEffect(() => {
    fetchChecklists();
  }, [])

  async function onRunClick(checklist) {
    const {
      latest_run: latestRun,
    } = checklist;

    let runPk = null
    if (u.shouldStartNewRun(checklist)) {
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

  if (checklists.length === 0) {
    return <Onboarding />
  }

  return (
    <BaseChecklistListView
      checklists={checklists}
      onRunClick={onRunClick}
      onDeleteClick={onDeleteClick}
    />
  )
}


function BaseChecklistListView(props) {
  return (
    <View className="ChecklistListView">
      <TitleContainer>
        <HeroTitle>Your checklists</HeroTitle>
        <NewChecklistButton />
      </TitleContainer>
      <ChecklistList
        checklists={props.checklists}
        onRunClick={props.onRunClick}
        onDeleteClick={props.onDeleteClick}
      />
    </View>
  )
}

