import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import _ from 'lodash';

import ChecklistDescription from './ChecklistDescription';
import ChecklistItems from './ChecklistItems';
import ChecklistItem from './ChecklistItem';
import { View, TitleContainer } from '../common/components/View';
import { BackButton, ChecklistCloseButton, ButtonContainer } from '../common/components/Buttons';
import { InputGroup } from '../common/components/formStuff';
import { HeroTitle } from '../common/components/Title';
import { Dropdown } from 'semantic-ui-react';
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


export default function ChecklistRunView() {
  console.log('Rendering')
  let history = useHistory();
  const { id: checklistRunId } = useParams()
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
      const response = await fetchChecklistRun(checklistRunId);
      if (!response.error) {
        fetchFilteredChecklistRuns(response.data.checklist_pk)
      }
    })()

    return () => {
      unsetCurrentChecklistRun()
    }
  }, [checklistRunId])

  if (!checklistRun) {
    return <h1>Loading</h1>
  }

  return (
    <BaseChecklistRunView
      checklistRun={checklistRun}
      checklistRuns={checklistRuns}
      checklistRunId={checklistRunId}
      onCheckboxChange={onCheckboxChange}
      onCloseClick={onCloseClick}
      updateChecklistRun={updateChecklistRun}
      fetchFilteredChecklistRuns={fetchFilteredChecklistRuns}
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
      />
      <ChecklistRunList
        checklistRuns={props.checklistRuns}
        activeChecklistRunId={props.checklistRunId}
      />
    </View>
  )
}

function ChecklistRunDetails(props) {
  return (
    <div className="ChecklistRunDetails">
      {/* <TitleContainer>
        <HeroTitle>{props.checklistRun.title} - {props.checklistRun.name}</HeroTitle>
      </TitleContainer>
      <ChecklistDescription>{props.checklistRun.description}</ChecklistDescription> */}


      <ChecklistItems>
        <ChecklistRunForm
          checklistRun={props.checklistRun}
          onCheckboxChange={props.onCheckboxChange}
          updateChecklistRun={props.updateChecklistRun}
          fetchFilteredChecklistRuns={props.fetchFilteredChecklistRuns}
        />
      </ChecklistItems>

      <ButtonContainer style={{ justifyContent: "space-between" }}>
        <BackButton to="/checklists/" />
        {/* <ChecklistCloseButton onCloseClick={props.onCloseClick} /> */}
      </ButtonContainer>
    </div>
  );
}


function ChecklistRunForm(props) {
  const [rerenderer, setRerenderer] = React.useState(false);
  const { register, control, getValues, handleSubmit, errors } = useForm({
    defaultValues: {
      items: props.checklistRun.items,
      name: props.checklistRun.name,
      title: props.checklistRun.title,
      description: props.checklistRun.description,
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
      <ButtonContainer>

        <Dropdown
          floating
          direction="left"
          icon='ellipsis vertical'
          className='Button MiscButton NoText'
        >
          <Dropdown.Menu>
            <Dropdown.Item><Icon icon="check" /> Complete</Dropdown.Item>
            <Dropdown.Item><Icon icon="plus" /> New Run</Dropdown.Item>
            <Dropdown.Item><Icon icon="tag" /> Rename</Dropdown.Item>
            <Dropdown.Item><Icon icon="bars" /> Run list</Dropdown.Item>
            <Dropdown.Item><Icon icon="archive" /> Archive</Dropdown.Item>
            <Dropdown.Item><Icon icon="trash" /> Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ButtonContainer>
      <InputGroup
        name="description"
        placeholder="Description"
        register={register}
        error={errors.description?.message}
        className="ChecklistDescription HeroSubTitle"
        label="Description"
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
      <button type="submit">Save</button>
    </form>
  )
}