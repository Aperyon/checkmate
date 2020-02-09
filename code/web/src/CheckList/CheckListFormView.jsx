import React from "react";
import { Link, useParams, Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import _ from 'lodash';

import { Context as CheckListContext } from '../contexts/CheckListsContext';
import { ActionButton } from '../CheckListList/Buttons';





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
  } = React.useContext(CheckListContext)
  React.useEffect(() => {
    fetchCurrentChecklist(checkListID)
  }, [])

  console.log('checklistID', checkListID)
  if (!checkListID) {
    return (
      <div className="View CheckListItemView">
        <Link to="/checklists/">Back</Link>
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
      <Link to="/checklists/">Back</Link>
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
          className="TitleInput"
          name="title"
          placeholder="Title"
          ref={register()}
        />
        {errors.title && errors.title.message}
      </div>

      <div className="InputGroup">
        <input
          className="DescriptionInput"
          name="description"
          placeholder="Description"
          ref={register()}
        />
        {errors.description && errors.description.message}
      </div>

      {fields.map((item, index) => (
        <div className="InputGroup" key={item.id}>
          <input
            name={`items[${index}].text`}
            ref={register()}
            placeholder="item"
            onChange={_.debounce(() => { handleItemsChange(getValues(), append) }, 1)}
          />
          <button
            onClick={() => remove(index)}
            type="button"
          >
            Delete
          </button>
          {errors.description && errors.description.message}
        </div>
      ))}

      <button type="button" onClick={() => append({ name: "item" })} >
        Add
        </button>
      <ActionButton type="submit">I'm done!</ActionButton>
    </form>
  )
}