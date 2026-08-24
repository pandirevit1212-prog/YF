import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { LanguageSwitcher } from './LanguageSwitcher'
import { logout } from '../lib/auth'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>{t('app.title')}</h1>
          </div>
          <nav className="nav">
            <button onClick={() => navigate('/')} className="nav-link">
              {t('nav.home')}
            </button>
            <button onClick={() => navigate('/entry')} className="nav-link">
              {t('nav.entry')}
            </button>
            <button onClick={() => navigate('/rates')} className="nav-link">
              {t('nav.rates')}
            </button>
            <button onClick={() => navigate('/reports')} className="nav-link">
              {t('nav.reports')}
            </button>
            <button onClick={() => navigate('/history')} className="nav-link">
              {t('nav.history')}
            </button>
            <button onClick={() => navigate('/deleted')} className="nav-link">
              {t('nav.deleted')}
            </button>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher />
            {user && (
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  {t('nav.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}
