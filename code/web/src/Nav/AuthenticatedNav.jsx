import React from 'react';
import { Link } from 'react-router-dom';
import NavModal from './NavModal';

import Logo from '../common/components/Logo';


export default function Nav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="Nav">
      <div></div>
      <div><Link to="/checklists/"><Logo /></Link></div>
      <div>
        <span className="SmallMenu" onClick={() => setIsOpen(true)}><i className="fa fa-bars"></i></span>
        <NavModal open={isOpen} onClose={() => setIsOpen(false)}>
          <ul>
            <a href="https://forms.gle/a59Y8Ddac4khjZPg8" target="_blank" onClick={() => setIsOpen(false)}><li>Feedback</li></a>
            <Link to="/logout/" onClick={() => setIsOpen(false)}><li>Logout</li></Link>
          </ul>
        </NavModal>
      </div>
    </nav>
  )
}