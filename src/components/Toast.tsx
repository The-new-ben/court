import { createContext, useContext, useState, ReactNode } from 'react'

type ToastContextType = (message: string) => void

const ToastContext = createContext<ToastContextType>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const show = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
