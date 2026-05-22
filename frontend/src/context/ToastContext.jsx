import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext(null)

const TOAST_DURATION_MS = 4000

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])
    const timersRef = useRef(new Map())

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))

        const timer = timersRef.current.get(id)
        if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(id)
        }
    }, [])

    const showToast = useCallback((message, type = 'success') => {
        const id = crypto.randomUUID()

        setToasts((current) => [...current, { id, message, type }])

        const timer = setTimeout(() => {
            removeToast(id)
        }, TOAST_DURATION_MS)

        timersRef.current.set(id, timer)
    }, [removeToast])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    return context
}
