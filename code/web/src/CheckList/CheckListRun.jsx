import React from "react";
import { useParams } from 'react-router-dom';

import CheckListTitle from './CheckListTitle';
import CheckListDescription from './CheckListDescription';
import CheckListItems from './CheckListItems';
import CheckListItem from './CheckListItem';

import { Context as ChecklistRunContext } from '../contexts/CheckListRunContext';


export default function CheckListRun() {
  const { id: checkListRunID } = useParams()
  const {
    state: checkListRun,
    fetchCheckListRun,
    updateChecklistRunItem
  } = React.useContext(ChecklistRunContext);

  async function onCheckboxChange(event, item) {
    const newValue = event.target.checked
    updateChecklistRunItem(item, newValue)
  }

  React.useEffect(() => {
    fetchCheckListRun(checkListRunID);
  }, [])

  if (!checkListRun) {
    return <h1>Loading</h1>
  }

  return (
    <div className="View CheckListItemView">
      <CheckListTitle>{checkListRun.title}</CheckListTitle>
      <CheckListDescription>{checkListRun.description}</CheckListDescription>
      <CheckListItems>
        {checkListRun.items.map(item => (
          <CheckListItem
            key={item.url}
            item={item}
            runMode={true}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </CheckListItems>
    </div>
  );
}