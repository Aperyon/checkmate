import React from "react";
import { Link } from 'react-router-dom'

import { Context as CheckListsContext } from '../contexts/CheckListsContext';

import CheckListDescription from "../CheckList/CheckListDescription";
import CheckListTitle from "../CheckList/CheckListTitle";
import { ViewButton, RunButton, MiscButton } from './Buttons';
import CheckListItemMiscDropdown from './CheckListItemMiscDropdown'


export default function CheckListListItem(props) {
  const { setCurrentCheckList } = React.useContext(CheckListsContext);
  const { checkList } = props;

  return (
    <li className="CheckListListItem">
      <div className="CheckListDetails">
        <CheckListTitle small={true}>{checkList.title}</CheckListTitle>
        <CheckListDescription small={true}>{checkList.description}</CheckListDescription>
      </div>
      <div className="Actions">
        <Link to={`/checklists/${checkList.pk}/`}>
          <ViewButton />
        </Link>
        <RunButton onClick={() => props.onRunClick(checkList)} />
        {/* <MiscButton /> */}
        <CheckListItemMiscDropdown
          checklist={checkList}
          onDeleteClick={props.onDeleteClick}
        />
      </div>
    </li>
  )
}