import React from "react";
import { Link } from 'react-router-dom'

import { Context as ChecklistsContext } from '../contexts/ChecklistsContext';

import ChecklistDescription from "../Checklist/ChecklistDescription";
import ChecklistTitle from "../Checklist/ChecklistTitle";
import { RunButton, Button } from '../common/components/Buttons';
import ChecklistItemMiscDropdown from './ChecklistItemMiscDropdown'
import Icon from '../common/components/Icon';


export default function ChecklistListItem(props) {
  const { setCurrentChecklist } = React.useContext(ChecklistsContext);
  const { checklist } = props;


  return (
    <li className="ChecklistListItem">
      <div className="ChecklistDetails">
        <Link to={`/checklists/${checklist.pk}/`}>
          <ChecklistTitle small={true}>
            {checklist.title}
          </ChecklistTitle>
        </Link>
        <ChecklistDescription small={true}>{checklist.description}</ChecklistDescription>
      </div>
      <div className="Actions">
        {/* <Button className="NoText">
          <Icon icon="pencil" />
        </Button> */}
        <RunButton
          onClick={() => props.onRunClick(checklist)}
          shouldStartNewRun={props.shouldStartNewRun}
        />
        <ChecklistItemMiscDropdown
          checklist={checklist}
          onDeleteClick={props.onDeleteClick}
        />
      </div>
    </li>
  )
}