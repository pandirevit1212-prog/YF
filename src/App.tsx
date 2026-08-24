import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { ForgotPassword } from './pages/ForgotPassword'
import { Home } from './pages/Home'
import { SiteWorkEntry } from './pages/SiteWorkEntry'
import { RateManagement } from './pages/RateManagement'
import { AdminReport } from './pages/AdminReport'
import { EditHistory } from './pages/EditHistory'
import { DeletedHistory } from './pages/DeletedHistory'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/entry" element={<SiteWorkEntry />} />
                  <Route path="/rates" element={<RateManagement />} />
                  <Route path="/reports" element={<AdminReport />} />
                  <Route path="/history" element={<EditHistory />} />
                  <Route path="/deleted" element={<DeletedHistory />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
