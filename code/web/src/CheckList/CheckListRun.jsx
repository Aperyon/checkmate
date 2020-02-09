import React from "react";
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';

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
    updateChecklistRunItem,
    unsetCurrentChecklistRun,
  } = React.useContext(ChecklistRunContext);


  async function onCheckboxChange(event, item) {
    const newValue = event.target.checked
    updateChecklistRunItem(item, newValue)
  }

  React.useEffect(() => {
    fetchCheckListRun(checkListRunID);

    return () => {
      console.log('Unsetting current checklist')
      unsetCurrentChecklistRun()
    }
  }, [])

  if (!checkListRun) {
    return <h1>Loading</h1>
  }

  return (
    <div className="View CheckListItemView">
      <Link to="/checklists/">Back</Link>
      <CheckListTitle>{checkListRun.title}</CheckListTitle>
      <CheckListDescription>{checkListRun.description}</CheckListDescription>
      <CheckListItems>
        <ChecklistRunForm
          checklistRun={checkListRun}
          onCheckboxChange={onCheckboxChange}
        />
      </CheckListItems>
    </div>
  );
}


function ChecklistRunForm(props) {
  const { register, control } = useForm({
    defaultValues: { items: props.checklistRun.items }
  });
  const { fields } = useFieldArray({ control, name: "items" });

  return fields.map((item, index) => (
    <CheckListItem
      key={item.url}
      item={item}
      index={index}
      runMode={true}
      onCheckboxChange={props.onCheckboxChange}
      register={register}
    />
  ))
}