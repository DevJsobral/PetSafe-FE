import React from 'react'

export default function Input(props){
  return (
    <input
      className="w-full p-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-ps-teal"
      {...props}
    />
  )
}
