import React from 'react';

import { Context as AuthContext } from '../contexts/AuthContext';


export default function Logout() {
  const { logoutUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    logoutUser()
  }, [])
  return (
    <div className="View AuthView">
      <h1>Good bye!</h1>
    </div>
  )
}