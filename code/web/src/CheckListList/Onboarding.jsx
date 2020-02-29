import React from 'react';
import { Link } from 'react-router-dom';

import { ActionButton } from '../common/components/Buttons';


export default function Onboarding() {
  return (
    <>
      <h3>You have no checklists added yet. Add you first one now!</h3>
      <Link to="/checklists/new/">
        <ActionButton>Add</ActionButton>
      </Link>
    </>
  )
}