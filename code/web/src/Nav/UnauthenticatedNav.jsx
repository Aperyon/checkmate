import React from 'react';
import { Link } from 'react-router-dom';
import NavModal from './NavModal';

import Logo from '../common/components/Logo';


export default function Nav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="Nav">
      <div></div>
      <div><Logo /> CheckMate</div>
      <div>
        <span className="SmallMenu" onClick={() => setIsOpen(true)}><i className="fa fa-bars"></i></span>
        <NavModal open={isOpen} onClose={() => setIsOpen(false)}>
          <ul>
            <Link to="/login/"><li onClick={() => setIsOpen(false)}>Login</li></Link>
            <Link to="/signup/"><li onClick={() => setIsOpen(false)}>Sign up</li></Link>
          </ul>
        </NavModal>
      </div>
    </nav>
  )
}