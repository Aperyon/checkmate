import React from 'react';
import { Modal } from 'semantic-ui-react';


export default function NavModal(props) {
  return (
    <Modal
      basic
      open={props.open}
      size='small'
      className="NavModal"
      closeIcon
      onClose={props.onClose}
    >
      <Modal.Content>
        {props.children}
      </Modal.Content>
    </Modal>
  )
}