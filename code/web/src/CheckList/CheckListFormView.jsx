
import React from "react";
import { Link, useParams, Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import _ from 'lodash';

import Icon from '../common/components/Icon';
import { Context as ChecklistContext } from '../contexts/ChecklistsContext';
import { ActionButton, BackButton, Button, ButtonContainer } from '../common/components/Buttons';
import { InputGroup, FieldArrayInputGroup } from "../common/components/formStuff";


function handleItemsChange(values, append) {
  if (shouldAddExtraItem(values)) {
    append()
  }
}


function shouldAddExtraItem(values) {
  const itemFieldKeys = Object.keys(values).filter(fieldName => fieldName.indexOf('items[') === 0)
  const itemFieldValues = itemFieldKeys.map(key => values[key])
  return _.every(itemFieldValues.map(val => val.trim() !== ""))
}


export default function ChecklistFormView() {
  const { id: checklistID } = useParams();
  const {
    state: { currentChecklist },
    fetchCurrentChecklist,
    unsetCurrentChecklist,
  } = React.useContext(ChecklistContext)
  React.useEffect(() => {
    fetchCurrentChecklist(checklistID)
    return () => {
      unsetCurrentChecklist();
    }
  }, [])

  if (!checklistID) {
    return (
      <div className="View ChecklistItemView">
        <ChecklistForm />
      </div >
    )
  }

  if (currentChecklist === null) {
    return <h1>Loading</h1>
  } else if (shouldAddExtraItem(currentChecklist.items)) {
    currentChecklist.items.push({ text: "" })
  }

  return (
    <div className="View ChecklistItemView">
      <ChecklistForm checklist={currentChecklist} />
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
        placeholder="Start writing the title"
        register={register}
        error={errors.title?.message}
        className="ChecklistTitle"
      />
      <InputGroup
        name="description"
        placeholder="This checklist is about..."
        register={register}
        error={errors.description?.message}
        className="ChecklistDescription"
      />

      {fields.map((item, index) => (
        <div key={item.id} >
          <FieldArrayInputGroup
            name={`items[${index}].text`}
            register={register}
            placeholder="item"
            onChange={_.debounce(() => { handleItemsChange(getValues(), append) }, 1)}
            error={errors.description?.message}
            remove={() => remove(index)}
          />
          {/* <div className="InputGroup" key={item.id}>
            <input
              name={`items[${index}].text`}
              ref={register()}
              placeholder="item"
              onChange={_.debounce(() => { handleItemsChange(getValues(), append) }, 1)}
            />
            <Button
              className="Small"
              onClick={() => remove(index)}
              type="button"
            >
              <Icon icon="times" className="NoMargin" />
            </Button> */}
        </div >
      ))
      }

      <ButtonContainer style={{ justifyContent: 'space-between' }}>
        <div>
          <Button type="button" onClick={() => append({ name: "item" })}>
            <Icon icon="plus" />Add new item
        </Button>
        </div>
        <div>
          <Link to="/checklists/">
            <Button>Back</Button>
          </Link>
          <ActionButton type="submit">
            <Icon icon="check" /> I'm done!
        </ActionButton>
        </div>
      </ButtonContainer>
    </form >
  )
}