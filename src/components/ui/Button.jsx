import React from 'react'

export default function Button({ children, className='', ...props }){
  return (
    <button
      className={`rounded-2xl px-4 py-2 shadow-soft transition-all font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
