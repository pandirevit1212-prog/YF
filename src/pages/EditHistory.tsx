import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { EditHistory } from '../types'
import './History.css'

export function EditHistory() {
  const { t } = useTranslation()
  const [history, setHistory] = useState<EditHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('edit_history')
        .select('*')
        .order('edited_at', { ascending: false })

      if (queryError) throw queryError
      setHistory(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="history-container">
      <h2>{t('history.title')}</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">{t('history.noRecords')}</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>{t('history.editedBy')}</th>
                <th>{t('history.editedAt')}</th>
                <th>{t('common.action')}</th>
                <th>{t('report.work')}</th>
                <th>{t('common.details')}</th>
              </tr>
            </thead>
            <tbody>
              {history.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.user_email}</td>
                  <td>{new Date(entry.edited_at).toLocaleString()}</td>
                  <td>{entry.action}</td>
                  <td>{entry.record_type}</td>
                  <td>
                    <details className="details-summary">
                      <summary>{t('common.view')}</summary>
                      <div className="details-content">
                        <p><strong>Old:</strong> {JSON.stringify(entry.old_values, null, 2)}</p>
                        <p><strong>New:</strong> {JSON.stringify(entry.new_values, null, 2)}</p>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
