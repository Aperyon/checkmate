import React from 'react';

import { Dropdown } from 'semantic-ui-react';

import Icon from '../common/components/Icon';


export default function CheckListItemMiscDropdown(props) {
  return (
    <Dropdown
      icon='ellipsis vertical'
      className='Button MiscButton NoText'
    >
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => props.onDeleteClick(props.checklist)}
        >
          <Icon icon="trash" /> Delete checklist
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}