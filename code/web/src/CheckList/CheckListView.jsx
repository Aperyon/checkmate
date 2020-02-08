import React from "react";
import { Link } from 'react-router-dom';

import CheckListTitle from './CheckListTitle';
import CheckListDescription from './CheckListDescription';
import CheckListItems from './CheckListItems';
import CheckListItem from './CheckListItem';

import { ActionButton } from '../CheckListList/Buttons';


const checkList = {
  id: 1,
  title: 'First checklist ever',
  description: 'Lets see what you can do with checklists',
  items: [
    { id: 1, checked: false, text: 'Step 1' },
    { id: 2, checked: false, text: 'Step 1' },
    { id: 3, checked: false, text: 'Step 1' },
    { id: 4, checked: false, text: 'Step 1' },
    { id: 5, checked: false, text: 'Step 1' },
    { id: 6, checked: false, text: 'Step 1' },
  ]
}
export default function CheckListView(props) {
  // const { checkList } = props;
  return (
    <div className="View CheckListItemView">
      <Link to="/checklists/">Back</Link>
      <CheckListTitle className="Title">{checkList.title}</CheckListTitle>
      <CheckListDescription>{checkList.description}</CheckListDescription>
      <CheckListItems>
        {checkList.items.map(item => <CheckListItem item={item} runMode={false} />)}
      </CheckListItems>
      <ActionButton>I'm done!</ActionButton>
    </div>
  );
}