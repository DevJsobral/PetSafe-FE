import React from 'react'

export default function Card({ children, className='' }){
  return (
    <div className={`bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-soft ${className}`}>
      {children}
    </div>
  )
}
