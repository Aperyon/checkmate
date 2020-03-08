import React from 'react';


export function View({ children, ...props }) {
  return <div className={`View ${props.className || ''}`}>{children}</div>
}

export function TitleContainer({ children, ...props }) {
  return <div className={`TitleContainer ${props.className || ''}`}>{children}</div>
}