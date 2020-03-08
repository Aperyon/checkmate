import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import _ from 'lodash';

import { ChecklistItemRunMode, ChecklistItemEditMode } from './ChecklistItem';
import { View, TitleContainer } from '../common/components/View';
import { Button, BackButton, ButtonContainer, ActionButton } from '../common/components/Buttons';
import { InputGroup } from '../common/components/formStuff';
import { HeroTitle, HeroSubTitle } from '../common/components/Title';
import { Dropdown } from 'semantic-ui-react';
import Icon from '../common/components/Icon';
import * as u from './utils';
import RunEditToggle from './RunEditToggle';

import { Context as ChecklistRunContext } from '../contexts/ChecklistRunContext';
import ChecklistRunList from "./ChecklistRunList";


function alertRunIsArchived() {
  alert('This run is archived.\nThe next time you click Run it will start a new one.')
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


export default function ChecklistRunView() {
  let history = useHistory();
  const [showArchiveds, setShowArchiveds] = React.useState(false);
  const { id: checklistRunId } = useParams()
  const {
    state: { currentChecklistRun: checklistRun, checklistRuns },
    fetchChecklistRun,
    updateChecklistRunItem,
    unsetCurrentChecklistRun,
    updateChecklistRun,
    deleteChecklistRun,
    fetchChecklistRuns,
    createChecklistRun,
  } = React.useContext(ChecklistRunContext);

  async function onCheckboxChange(event, item, fields) {
    const newValue = event.target.checked
    const checkFields = getCheckFields(fields)
    if (isAllChecked(checkFields)) {
      setTimeout(async () => {
        await updateChecklistRun(checklistRun, { is_archived: true })
        await fetchFilteredChecklistRuns(checklistRun.checklist_pk)
        alertRunIsArchived()
      })
    }

    await updateChecklistRunItem(item, newValue)
    await fetchChecklistRun(checklistRunId)
  }

  // async function onCloseClick() {
  //   const confirmation = window.confirm('Are you sure you want to to mark this Run as completed?')
  //   if (!confirmation) {
  //     return;
  //   }

  //   const response = await updateChecklistRun(checklistRun, { is_closed: true })
  //   if (!response.error) {
  //     alert('This run is closed!\nClick Play to start a new run.')
  //     history.push('/checklists/')
  //   }
  // }

  async function fetchFilteredChecklistRuns(checklist_pk) {
    const filters = { checklist: checklist_pk }
    if (!showArchiveds) {
      filters.is_archived = false
    }
    return await fetchChecklistRuns({ filters })
  }

  React.useEffect(() => {
    (async () => {
      console.log('Fetching runs')
      const response = await fetchChecklistRun(checklistRunId);
      if (!response.error) {
        fetchFilteredChecklistRuns(response.data.checklist_pk)
      }
    })()

    return () => {
      unsetCurrentChecklistRun()
    }
  }, [checklistRunId, showArchiveds])


  async function onDeleteRunClick(checklistRun) {
    const confirmation = window.confirm('Are you sure you want to delete this Run?')
    if (confirmation) {
      await deleteChecklistRun(checklistRun)
      const response = await fetchFilteredChecklistRuns(checklistRun.checklist_pk)
      const newRuns = response.data
      const latestRun = newRuns[0]
      if (latestRun) {
        history.push(`/checklist-runs/${latestRun.pk}`)
      } else {
        history.push(`/checklists/`)
      }
    }
  }

  async function onArchiveClick(checklistRun) {
    const confirmation = window.confirm('Are you sure you want to archive this Run?')
    if (confirmation) {
      await updateChecklistRun(checklistRun, { is_archived: true })
      await fetchFilteredChecklistRuns(checklistRun.checklist_pk)
    }
  }

  async function onNewRunClick() {
    const response = await createChecklistRun(checklistRun.checklist);
    history.push(`/checklist-runs/${response.data.pk}/`)
  }

  if (!checklistRun || !checklistRuns) {
    return <h1>Loading</h1>
  }

  return (
    <BaseChecklistRunView
      checklistRun={checklistRun}
      checklistRuns={checklistRuns}
      checklistRunId={checklistRunId}
      onCheckboxChange={onCheckboxChange}
      updateChecklistRun={updateChecklistRun}
      fetchFilteredChecklistRuns={fetchFilteredChecklistRuns}
      onDeleteRunClick={onDeleteRunClick}
      onNewRunClick={onNewRunClick}
      onArchiveClick={onArchiveClick}
      showArchiveds={showArchiveds}
      setShowArchiveds={setShowArchiveds}
    />
  )
}

function BaseChecklistRunView(props) {
  return (
    <View className="ChecklistItemView">
      <ChecklistRunDetails
        checklistRun={props.checklistRun}
        onCheckboxChange={props.onCheckboxChange}
        updateChecklistRun={props.updateChecklistRun}
        onCloseClick={props.onCloseClick}
        fetchFilteredChecklistRuns={props.fetchFilteredChecklistRuns}
        onDeleteRunClick={props.onDeleteRunClick}
        onNewRunClick={props.onNewRunClick}
        onArchiveClick={props.onArchiveClick}
      />
      <ChecklistRunList
        checklistRuns={props.checklistRuns}
        activeChecklistRunId={props.checklistRunId}
        showArchiveds={props.showArchiveds}
        setShowArchiveds={props.setShowArchiveds}
      />
    </View>
  )
}

function ChecklistRunDetails(props) {
  const [editMode, setEditMode] = React.useState(false);
  return (
    <div className="ChecklistRunDetails">
      <RunEditToggle editMode={editMode} setEditMode={setEditMode} />

      {editMode ? (
        <ChecklistRunEditForm
          checklistRun={props.checklistRun}
          onCheckboxChange={props.onCheckboxChange}
          updateChecklistRun={props.updateChecklistRun}
          fetchFilteredChecklistRuns={props.fetchFilteredChecklistRuns}
          editMode={true}
          setEditMode={setEditMode}
        />
      ) : (
          <ChecklistRunForm
            checklistRun={props.checklistRun}
            onCheckboxChange={props.onCheckboxChange}
            updateChecklistRun={props.updateChecklistRun}
            fetchFilteredChecklistRuns={props.fetchFilteredChecklistRuns}
            editMode={false}
            setEditMode={setEditMode}
            onDeleteRunClick={props.onDeleteRunClick}
            onNewRunClick={props.onNewRunClick}
            onCloseClick={props.onCloseClick}
            onArchiveClick={props.onArchiveClick}
          />
        )
      }
    </div>
  );
}


function ChecklistRunEditForm(props) {
  const { register, control, getValues, handleSubmit, errors } = useForm({
    defaultValues: {
      items: [...props.checklistRun.items, { text: '' }],
      name: props.checklistRun.name,
      title: props.checklistRun.title,
      description: props.checklistRun.description,
    }
  });
  const { fields, remove, append } = useFieldArray({ control, name: "items" });

  async function onSubmit(values) {
    values.items = values.items.filter(i => !!i.text)
    values.items = values.items.map((item, index) => {
      return { ...item, order: index }
    });
    await props.updateChecklistRun(props.checklistRun, values);
    await props.fetchFilteredChecklistRuns(props.checklistRun.checklist_pk)
    props.setEditMode(false)
  }

  return (
    <form className="Form" onSubmit={handleSubmit(onSubmit)}>
      <InputGroup
        name="title"
        placeholder="Title"
        register={register}
        error={errors.title?.message}
        className="ChecklistTitle HeroTitle"
        label="Title"
      />
      <InputGroup
        name="description"
        placeholder="Description"
        register={register}
        error={errors.description?.message}
        className="ChecklistDescription HeroSubTitle"
        label="Description"
      />
      <ul className="ChecklistRunItems">
        {fields.map((item, index) => (
          <ChecklistItemEditMode
            key={item.id}
            item={item}
            index={index}
            register={register}
            remove={() => remove(index)}
            onChange={_.debounce(() => { u.handleItemsChange(getValues({ next: true }), append) }, 1)}
            isRemoveButtonDisabled={!item.text}
          />
        ))}
      </ul>
      <ButtonContainer>
        <ActionButton type="submit"><Icon icon="check" /> Save</ActionButton>
        <Button onClick={() => props.setEditMode(false)}>Cancel</Button>
      </ButtonContainer>
    </form>
  )
}


function ChecklistRunForm(props) {
  const [rerenderer, setRerenderer] = React.useState(false);
  const { register, unregister, control, getValues } = useForm({
    defaultValues: {
      items: props.checklistRun.items,
    }
  });
  const { fields } = useFieldArray({ control, name: "items" });

  function _handleKeyDown(event) {
    switch (event.keyCode) {
      case 69:  // e or E
        if (!props.editMode) {
          props.setEditMode(true)
        }
        return
      case 88:  // x or X
        props.onDeleteRunClick(props.checklistRun);
        return
      case 65:  // a or A
        props.onArchiveClick(props.checklistRun);
        return
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", _handleKeyDown);

    return () => {
      document.removeEventListener("keydown", _handleKeyDown);
    }
  }, [])

  function onCheckboxChange(event, item) {
    setRerenderer(!rerenderer)
    props.onCheckboxChange(event, item, getValues())
  }

  return (
    <form className="Form">
      <TitleContainer>
        <HeroTitle>{props.checklistRun.title}</HeroTitle>
        <ButtonContainer>
          <Dropdown
            floating
            direction="left"
            icon='ellipsis vertical'
            className='Button MiscButton NoText'
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={props.onNewRunClick}
              >
                <Icon icon="plus" /> New Run
                </Dropdown.Item>
              <Dropdown.Item
                onClick={() => props.onArchiveClick(props.checklistRun)}
              >
                <Icon icon="archive" /> Archive
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => props.onDeleteRunClick(props.checklistRun)}
              >
                <Icon icon="trash" /> Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ButtonContainer>
      </TitleContainer>
      <HeroSubTitle>{props.checklistRun.description}</HeroSubTitle>

      <ul className="ChecklistRunItems">
        {fields.map((item, index) => (
          <ChecklistItemRunMode
            key={item.id}
            item={item}
            index={index}
            onCheckboxChange={(event, item) => onCheckboxChange(event, item)}
            register={register}
            isChecked={getValues({ nest: true }).items[index].is_checked}
          />
        ))}
      </ul>
      <ButtonContainer>
        <BackButton to="/checklists/" />
      </ButtonContainer>
    </form>
  )
}