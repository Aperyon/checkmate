import React from 'react';


export default function Icon({ icon, className }) {
  return <i className={`Icon fa fa-${icon} ${className}`} />
}