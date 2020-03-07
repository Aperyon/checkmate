import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import _ from 'lodash';

import ChecklistTitle from './ChecklistTitle';
import ChecklistDescription from './ChecklistDescription';
import ChecklistItems from './ChecklistItems';
import ChecklistItem from './ChecklistItem';
import { ActionButton, BackButton } from '../common/components/Buttons';
import Icon from '../common/components/Icon';
import { InputGroup } from '../common/components/formStuff';

import { Context as ChecklistRunContext } from '../contexts/ChecklistRunContext';
import ChecklistRunList from "./ChecklistRunList";


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
  console.log('Rendering')
  let history = useHistory();
  const { id: checklistRunID } = useParams()
  const {
    state: { currentChecklistRun: checklistRun, checklistRuns },
    fetchChecklistRun,
    updateChecklistRunItem,
    unsetCurrentChecklistRun,
    updateChecklistRun,
    fetchChecklistRuns,
  } = React.useContext(ChecklistRunContext);

  async function onCheckboxChange(event, item, fields) {
    const newValue = event.target.checked

    const checkFields = getCheckFields(fields)
    if (isAllChecked(checkFields)) {
      setTimeout(() => {
        alertRunIsComplete()
      })
    }

    updateChecklistRunItem(item, newValue)
  }

  async function onCloseClick() {
    const response = await updateChecklistRun(checklistRun, { is_closed: true })
    if (!response.error) {
      alert('This run is closed!\nClick Play to start a new run.')
      history.push('/checklists/')
    }
  }

  async function fetchFilteredChecklistRuns(checklist_pk) {
    await fetchChecklistRuns({ filters: { checklist: checklist_pk } })
  }

  React.useEffect(() => {
    (async () => {
      const response = await fetchChecklistRun(checklistRunID);
      if (!response.error) {
        fetchFilteredChecklistRuns(response.data.checklist_pk)
      }
    })()

    return () => {
      unsetCurrentChecklistRun()
    }
  }, [checklistRunID])

  if (!checklistRun) {
    return <h1>Loading</h1>
  }

  return (
    <div className="View ChecklistItemView">
      <div>
        <div className="ChecklistTitleContainer">
          <div>
            <ChecklistTitle>{checklistRun.title}</ChecklistTitle>
          </div>
          <div>
            <ActionButton onClick={onCloseClick}>
              <Icon icon="archive" />
              Close
            </ActionButton>
          </div>
        </div>
        <ChecklistDescription>{checklistRun.description}</ChecklistDescription>
        <ChecklistItems>
          <ChecklistRunForm
            checklistRun={checklistRun}
            onCheckboxChange={onCheckboxChange}
            updateChecklistRun={updateChecklistRun}
            fetchFilteredChecklistRuns={fetchFilteredChecklistRuns}
          />
        </ChecklistItems>
        <BackButton to="/checklists/">Go back</BackButton>
      </div>
      <ChecklistRunList
        checklistRuns={checklistRuns}
        activeChecklistRunId={checklistRunID}
      />
    </div>
  );
}


function ChecklistRunForm(props) {
  const [rerenderer, setRerenderer] = React.useState(false);
  const { register, control, getValues, handleSubmit } = useForm({
    defaultValues: {
      items: props.checklistRun.items,
      name: props.checklistRun.name,
    }
  });
  const { fields } = useFieldArray({ control, name: "items" });

  function onCheckboxChange(event, item) {
    setRerenderer(!rerenderer)
    props.onCheckboxChange(event, item, getValues())
  }

  async function onSubmit(values) {
    await props.updateChecklistRun(props.checklistRun, values);
    await props.fetchFilteredChecklistRuns(props.checklistRun.checklist_pk)
    setTimeout(() => { alert('Run name updated!') }, 0)
  }

  return (
    <form className="Form" onSubmit={handleSubmit(onSubmit)}>
      <InputGroup
        type="text"
        register={register}
        name="name"
        label="Run name"
      />
      {fields.map((item, index) => (
        <ChecklistItem
          key={item.url}
          item={item}
          index={index}
          runMode={true}
          onCheckboxChange={(event, item) => onCheckboxChange(event, item)}
          register={register}
          isChecked={getValues()[`items[${index}].is_checked`]}
        />
      ))}
    </form>
  )
}