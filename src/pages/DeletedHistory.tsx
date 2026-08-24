import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { DeletedRecord } from '../types'
import './History.css'

export function DeletedHistory() {
  const { t } = useTranslation()
  const [deletedRecords, setDeletedRecords] = useState<DeletedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDeletedRecords()
  }, [])

  const fetchDeletedRecords = async () => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('deleted_records')
        .select('*')
        .order('deleted_at', { ascending: false })

      if (queryError) throw queryError
      setDeletedRecords(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="history-container">
      <h2>{t('deleted.title')}</h2>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : deletedRecords.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">{t('deleted.noRecords')}</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>{t('deleted.deletedDate')}</th>
                <th>{t('deleted.site')}</th>
                <th>{t('deleted.work')}</th>
                <th>{t('deleted.originalDate')}</th>
                <th>{t('deleted.workerName')}</th>
                <th>{t('deleted.workerId')}</th>
                <th>{t('deleted.siteEngineer')}</th>
                <th>{t('deleted.area')}</th>
                <th>{t('deleted.cost')}</th>
                <th>{t('deleted.deletedBy')}</th>
              </tr>
            </thead>
            <tbody>
              {deletedRecords.map(record => {
                const data = record.data as any
                return (
                  <tr key={record.id}>
                    <td>{new Date(record.deleted_at).toLocaleString()}</td>
                    <td>{data.site}</td>
                    <td>{data.work}</td>
                    <td>{data.date}</td>
                    <td>{data.worker_name}</td>
                    <td>{data.worker_id}</td>
                    <td>{data.site_engineer}</td>
                    <td>{data.area}</td>
                    <td>{data.cost}</td>
                    <td>{record.user_email}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
