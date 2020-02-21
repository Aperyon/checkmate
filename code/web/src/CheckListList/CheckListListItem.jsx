import React from "react";
import { Link } from 'react-router-dom'

import { Context as CheckListsContext } from '../contexts/CheckListsContext';

import CheckListDescription from "../CheckList/CheckListDescription";
import CheckListTitle from "../CheckList/CheckListTitle";
import { ViewButton, RunButton, MiscButton } from '../common/components/Buttons';
import CheckListItemMiscDropdown from './CheckListItemMiscDropdown'


export default function CheckListListItem(props) {
  const { setCurrentCheckList } = React.useContext(CheckListsContext);
  const { checkList } = props;


  return (
    <li className="CheckListListItem">
      <div className="CheckListDetails">
        <Link to={`/checklists/${checkList.pk}/`}>
          <CheckListTitle small={true}>{checkList.title}</CheckListTitle>
        </Link>
        <CheckListDescription small={true}>{checkList.description}</CheckListDescription>
      </div>
      <div className="Actions">
        <RunButton
          onClick={() => props.onRunClick(checkList)}
          shouldStartNewRun={props.shouldStartNewRun}
        />
        {/* <MiscButton /> */}
        <CheckListItemMiscDropdown
          checklist={checkList}
          onDeleteClick={props.onDeleteClick}
        />
      </div>
    </li>
  )
}