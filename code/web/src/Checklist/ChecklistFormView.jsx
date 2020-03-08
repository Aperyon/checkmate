
import React from "react";
import { Link, useParams, Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import _ from 'lodash';

import Icon from '../common/components/Icon';
import { Context as ChecklistContext } from '../contexts/ChecklistsContext';
import { ActionButton, BackButton, Button, ButtonContainer } from '../common/components/Buttons';
import { InputGroup, FieldArrayInputGroup } from "../common/components/formStuff";
import * as u from './utils';


export default function ChecklistFormView() {
  const { id: checklistID } = useParams();
  const {
    state: { currentChecklist },
    fetchCurrentChecklist,
    unsetCurrentChecklist,
  } = React.useContext(ChecklistContext)
  React.useEffect(() => {
    if (checklistID) {
      fetchCurrentChecklist(checklistID)
    }

    return () => {
      unsetCurrentChecklist();
    }
  }, [])

  if (!checklistID) {
    return (
      <div className="View ChecklistItemView ChecklistFormView">
        <div>
          <ChecklistForm />
        </div>
        <ChecklistTips />
      </div >
    )
  }

  if (currentChecklist === null) {
    return <h1>Loading</h1>
  } else if (u.shouldAddExtraItem(currentChecklist.items)) {
    currentChecklist.items.push({ text: "" })
  }

  return (
    <div className="View ChecklistItemView ChecklistFormView">
      <ChecklistForm checklist={currentChecklist} />
      {/* <ChecklistTips /> */}
    </div >
  )
}


function ChecklistForm({ checklist }) {
  const { id: checklistID } = useParams();
  const {
    unsetCurrentChecklist,
    addChecklist,
    updateChecklist,
  } = React.useContext(ChecklistContext)
  let defaultValues = {
    items: [
      { text: "" },
    ]
  }
  if (checklist) {
    defaultValues = checklist
  }
  const [shouldGoBack, setShouldGoBack] = React.useState(false)
  const { handleSubmit, register, errors, control, getValues, setError } = useForm({
    defaultValues
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  async function onSubmit(values) {
    values.items = values.items.filter(item => item.text.trim() !== '')

    if (checklistID) {
      const response = await updateChecklist(checklistID, values)
      if (response.error) {
        if (!response.data) {
          alert('unknown error')
        } else {
          Object.keys(response.data).forEach(errorKey => {
            setError(errorKey, null, response.data[errorKey][0])
          })
        }
      } else {
        setShouldGoBack(true);
        unsetCurrentChecklist();
      }
    } else {
      const response = await addChecklist(values)

      if (response.error) {
        if (!response.data) {
          alert('unknown error')
        } else {
          Object.keys(response.data).forEach(errorKey => {
            setError(errorKey, null, response.data[errorKey][0])
          })
        }
      } else {
        setShouldGoBack(true);
        unsetCurrentChecklist();
      }
    }
  }

  if (shouldGoBack) {
    return <Redirect to="/checklists/" />
  }

  return (
    <form className="Form ChecklistForm" onSubmit={handleSubmit(onSubmit)}>
      <InputGroup
        name="title"
        placeholder="Title"
        register={register}
        error={errors.title?.message}
        className="ChecklistTitle HeroTitle"
      />
      <InputGroup
        name="description"
        placeholder="Description"
        register={register}
        error={errors.description?.message}
        className="ChecklistDescription HeroSubTitle"
      />

      {fields.map((item, index) => (
        <div key={item.id} >
          <FieldArrayInputGroup
            name={`items[${index}].text`}
            register={register}
            placeholder="item"
            onChange={_.debounce(() => { u.handleItemsChange(getValues(), append) }, 1)}
            remove={() => remove(index)}
            isRemoveButtonDisabled={!item.text}
          />
        </div >
      ))
      }

      <ButtonContainer style={{ justifyContent: 'flex-start' }}>
        <ActionButton type="submit">
          <Icon icon="check" /> Save
        </ActionButton>
        <Link to="/checklists/">
          <Button>{checklistID ? "Cancel" : "Disacrd"}</Button>
        </Link>
      </ButtonContainer>
    </form >
  )
}


function ChecklistTips() {
  return (
    <div className="ChecklistTips">
      <h3 className="Title">Tips for making a good checklist</h3>
      <ul>
        <li><p>
          Each item is actionable
        </p></li>
        <li><p>
          Add Pause Points as needed
        </p></li>
        <li><p>
          Start each item with a verb (simple present tense)
        </p></li>
      </ul>
    </div>
  )
}