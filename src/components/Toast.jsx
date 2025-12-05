import React, { useEffect } from 'react'

export default function Toast({ message, onClose, type='info' }){
  useEffect(() => {
    if(!message) return
    const t = setTimeout(() => onClose && onClose(), 3500)
    return () => clearTimeout(t)
  }, [message, onClose])
  
  if(!message) return null
  
  const styles = {
    info: 'bg-teal-600 dark:bg-teal-500 text-white',
    error: 'bg-red-500 dark:bg-red-600 text-white',
    success: 'bg-green-500 dark:bg-green-600 text-white',
    warning: 'bg-orange-500 dark:bg-orange-600 text-white'
  }
  
  return (
    <div 
      className={`fixed right-4 bottom-6 px-6 py-3 rounded-lg shadow-xl dark:shadow-2xl border border-white/10 ${styles[type] || styles.info} animate-in slide-in-from-right-5 duration-300 backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">
          {type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}