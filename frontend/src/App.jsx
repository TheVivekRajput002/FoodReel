import AppRoutes from './routes/AppRoutes'
import { ToastProvider } from './context/ToastContext'
import './App.css'


function App() {

  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  )
}

export default App
