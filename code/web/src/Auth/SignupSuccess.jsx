import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupSuccess() {
  return (
    <div className="View AuthView">
      <div className="AuthFeedback">
        <h1 className="HeroTitle">Success</h1>
        <h3 className="HeroSubTitle">You have successfully signed up</h3>
        <p><Link to="/login/">Go to login</Link></p>
      </div>
    </div>
  )
}