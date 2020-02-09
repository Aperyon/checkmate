import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../common/components/Logo';


export default function Nav() {

  return (
    <nav className="Nav">
      <div></div>
      <div><Logo /> CheckMate</div>
      <div>
        <ul>
          <Link to="/logout/"><li>Logout</li></Link>
        </ul>
      </div>
    </nav>
  )
}