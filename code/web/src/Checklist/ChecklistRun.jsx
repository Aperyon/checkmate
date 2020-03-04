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

  React.useEffect(() => {
    (async () => {
      const response = await fetchChecklistRun(checklistRunID);
      if (!response.error) {
        fetchChecklistRuns({ filters: { checklist: response.data.checklist } })
      }
    })()

    return () => {
      unsetCurrentChecklistRun()
    }
  }, [])

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
          />
        </ChecklistItems>
        <BackButton to="/checklists/">Go back</BackButton>
      </div>
      <ChecklistRunList checklistRuns={checklistRuns} />
    </div>
  );
}


function ChecklistRunForm(props) {
  const [rerenderer, setRerenderer] = React.useState(false);
  const { register, control, getValues } = useForm({
    defaultValues: { items: props.checklistRun.items }
  });
  const { fields } = useFieldArray({ control, name: "items" });

  function onCheckboxChange(event, item) {
    setRerenderer(!rerenderer)
    props.onCheckboxChange(event, item, getValues())
  }

  return fields.map((item, index) => (
    <ChecklistItem
      key={item.url}
      item={item}
      index={index}
      runMode={true}
      onCheckboxChange={(event, item) => onCheckboxChange(event, item)}
      register={register}
      isChecked={getValues()[`items[${index}].is_checked`]}
    />
  ))
}