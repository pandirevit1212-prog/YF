import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import './Home.css'

export function Home() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>
  }

  const isAdmin = user?.user_metadata?.role === 'admin'

  return (
    <div className="home-container">
      <div className="welcome-card">
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
        <p className="welcome-text">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>{t('nav.entry')}</h3>
          <p>Record site work details and track costs</p>
          <button onClick={() => navigate('/entry')} className="btn btn-primary">
            {t('nav.entry')}
          </button>
        </div>

        <div className="feature-card">
          <h3>{t('nav.rates')}</h3>
          <p>Manage work rates and pricing</p>
          <button onClick={() => navigate('/rates')} className="btn btn-primary">
            {t('nav.rates')}
          </button>
        </div>

        {isAdmin && (
          <div className="feature-card">
            <h3>{t('nav.reports')}</h3>
            <p>View comprehensive project reports</p>
            <button onClick={() => navigate('/reports')} className="btn btn-primary">
              {t('nav.reports')}
            </button>
          </div>
        )}

        <div className="feature-card">
          <h3>{t('nav.history')}</h3>
          <p>Track all changes and modifications</p>
          <button onClick={() => navigate('/history')} className="btn btn-primary">
            {t('nav.history')}
          </button>
        </div>

        <div className="feature-card">
          <h3>{t('nav.deleted')}</h3>
          <p>Review deleted records</p>
          <button onClick={() => navigate('/deleted')} className="btn btn-primary">
            {t('nav.deleted')}
          </button>
        </div>
      </div>
    </div>
  )
}
