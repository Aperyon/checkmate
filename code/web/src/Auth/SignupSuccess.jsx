import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupSuccess() {
  return (
    <div className="View AuthView">
      <div className="AuthFeedback">
        <h1>Success</h1>
        <h3>You have successfully signed up</h3>
        <p><Link to="/login/">Go to login</Link></p>
      </div>
    </div>
  )
}