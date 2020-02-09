import React from 'react';

import { Context as AuthContext } from '../contexts/AuthContext';
import AuthenticatedNav from './AuthenticatedNav'
import UnauthenticatedNav from './UnauthenticatedNav'

export default function Nav() {
  const { state: authState } = React.useContext(AuthContext);

  if (authState.isAuthenticated) {
    return <AuthenticatedNav />
  }

  return (
    <UnauthenticatedNav />
  )
}