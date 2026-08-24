import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { resetPassword } from '../lib/auth'
import './AuthPages.css'

export function ForgotPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{t('auth.forgotPassword')}</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Check your email for password reset link</div>}

        {!success ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">{t('auth.email')}</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('common.loading') : t('auth.sendReset')}
            </button>
          </form>
        ) : null}

        <div className="auth-links">
          <Link to="/login" className="link">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}
