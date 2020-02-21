import React from "react";
import { useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import _ from 'lodash';

import ChecklistTitle from './ChecklistTitle';
import ChecklistDescription from './ChecklistDescription';
import ChecklistItems from './ChecklistItems';
import ChecklistItem from './ChecklistItem';
import { BackButton } from '../common/components/Buttons';

import { Context as ChecklistRunContext } from '../contexts/ChecklistRunContext';


function alertRunIsComplete() {
  alert('Your checklist run is complete.\nThe next time you click Run it will start a new one.')
}


function isAllChecked(values) {
  return _.every(values, (value) => value)
}

function getCheckFields(fieldsObj) {
  const fields = Object.keys(fieldsObj);
  const relevantFieldNames = fields.filter(fieldName => (
    fieldName.includes('items[') && fieldName.includes('is_checked')
  ));
  return _.pickBy(fieldsObj, (value, key) => relevantFieldNames.indexOf(key) > -1)
}


export default function ChecklistRun() {
  const { id: checklistRunID } = useParams()
  const {
    state: checklistRun,
    fetchChecklistRun,
    updateChecklistRunItem,
    unsetCurrentChecklistRun,
  } = React.useContext(ChecklistRunContext);


  async function onCheckboxChange(event, item, fields) {
    const newValue = event.target.checked

    const checkFields = getCheckFields(fields)
    if (isAllChecked(checkFields)) {
      alertRunIsComplete()
    }

    updateChecklistRunItem(item, newValue)
  }

  React.useEffect(() => {
    fetchChecklistRun(checklistRunID);

    return () => {
      unsetCurrentChecklistRun()
    }
  }, [])

  if (!checklistRun) {
    return <h1>Loading</h1>
  }

  return (
    <div className="View ChecklistItemView">
      <ChecklistTitle>{checklistRun.title}</ChecklistTitle>
      <ChecklistDescription>{checklistRun.description}</ChecklistDescription>
      <ChecklistItems>
        <ChecklistRunForm
          checklistRun={checklistRun}
          onCheckboxChange={onCheckboxChange}
        />
      </ChecklistItems>
      <BackButton to="/checklists/">Go back</BackButton>
    </div>
  );
}


function ChecklistRunForm(props) {
  const { register, control, getValues } = useForm({
    defaultValues: { items: props.checklistRun.items }
  });
  const { fields } = useFieldArray({ control, name: "items" });

  return fields.map((item, index) => (
    <ChecklistItem
      key={item.url}
      item={item}
      index={index}
      runMode={true}
      onCheckboxChange={(event, item) => props.onCheckboxChange(event, item, getValues())}
      register={register}
    />
  ))
}