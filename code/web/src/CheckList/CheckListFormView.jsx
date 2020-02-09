import React from "react";
import { Link, useParams, Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import _ from 'lodash';

import Icon from '../common/components/Icon';
import { Context as CheckListContext } from '../contexts/CheckListsContext';
import { ActionButton, BackButton, Button, ButtonContainer } from '../CheckListList/Buttons';


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


export default function CheckListFormView() {
  const { id: checkListID } = useParams();
  const {
    state: { currentCheckList },
    fetchCurrentChecklist,
    unsetCurrentChecklist,
  } = React.useContext(CheckListContext)
  React.useEffect(() => {
    fetchCurrentChecklist(checkListID)
    return () => {
      unsetCurrentChecklist();
    }
  }, [])

  if (!checkListID) {
    return (
      <div className="View CheckListItemView">
        <BackButton to="/checklists/">Back</BackButton>
        <CheckListForm />
      </div >
    )
  }

  if (currentCheckList === null) {
    return <h1>Loading</h1>
  } else if (shouldAddExtraItem(currentCheckList.items)) {
    currentCheckList.items.push({ text: "" })
  }

  return (
    <div className="View CheckListItemView">
      <BackButton to="/checklists/">Go back</BackButton>
      <CheckListForm checklist={currentCheckList} />
    </div >
  )
}


function CheckListForm({ checklist }) {
  const { id: checkListID } = useParams();
  const {
    unsetCurrentChecklist,
    addChecklist,
    updateChecklist,
  } = React.useContext(CheckListContext)
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

    if (checkListID) {
      const response = await updateChecklist(checkListID, values)
      if (response.error) {
        console.log(response)
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
    <form className="CheckListForm" onSubmit={handleSubmit(onSubmit)}>
      <div className="InputGroup">
        <input
          className="CheckListTitle"
          name="title"
          placeholder="Title"
          ref={register()}
        />
        {errors.title && errors.title.message}
      </div>

      <div className="InputGroup">
        <textarea
          className="CheckListDescription"
          name="description"
          placeholder="Description"
          ref={register()}
        />
        {errors.description && errors.description.message}
      </div>

      {fields.map((item, index) => (
        <div className="InputGroup CheckListItem" key={item.id}>
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
            <Icon icon="times" />Delete
          </Button>
          {errors.description && errors.description.message}
        </div>
      ))}

      <ButtonContainer style={{ justifyContent: 'space-between' }}>
        <Button type="button" onClick={() => append({ name: "item" })}>
          <Icon icon="plus" />Add new item
        </Button>
        <ActionButton type="submit">
          <Icon icon="check" /> I'm done!
        </ActionButton>
      </ButtonContainer>
    </form>
  )
}