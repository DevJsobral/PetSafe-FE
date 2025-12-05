import React from 'react'

export default function Loading(){
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-teal-600 dark:border-teal-400"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
          🐾
        </div>
      </div>
    </div>
  )
}