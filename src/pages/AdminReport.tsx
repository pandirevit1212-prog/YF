import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { SiteWork } from '../types'
import './AdminReport.css'

export function AdminReport() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<SiteWork[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAndFetchRecords()
  }, [])

  const checkAdminAndFetchRecords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setIsAdmin(user.user_metadata?.role === 'admin')
      await fetchRecords()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('site_works')
        .select('*')
        .order('date', { ascending: false })

      if (queryError) throw queryError
      setRecords(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('report.confirmDelete'))) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const record = records.find(r => r.id === id)
      if (!record) return

      // Insert into deleted records
      await supabase.from('deleted_records').insert([{
        record_id: id,
        record_type: 'site_work',
        data: record,
        deleted_by: user.id,
        user_email: user.email,
      }])

      // Delete the record
      const { error: deleteError } = await supabase
        .from('site_works')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setRecords(records.filter(r => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('report.deleteError'))
    }
  }

  const handleExportCSV = () => {
    const headers = [
      t('report.site'),
      t('report.work'),
      t('report.date'),
      t('report.editedDateTime'),
      t('report.day'),
      t('report.workerName'),
      t('report.workerId'),
      t('report.siteEngineer'),
      t('report.area'),
      t('report.rate'),
      t('report.cost'),
      t('report.signature'),
      t('report.remarks'),
    ]

    const csv = [
      headers.join(','),
      ...records.map(r =>
        [
          r.site,
          r.work,
          r.date,
          r.updated_at || r.created_at,
          r.day,
          r.worker_name,
          r.worker_id,
          r.site_engineer,
          r.area,
          r.rate_id,
          r.cost,
          r.signature,
          r.remarks,
        ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAdmin) {
    return <div className="empty-state">{t('report.adminOnly')}</div>
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>{t('report.title')}</h2>
        <button className="btn btn-primary" onClick={handleExportCSV}>
          {t('report.export')}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">{t('report.noRecords')}</div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="report-table">
            <thead className="sticky-header">
              <tr>
                <th>{t('report.site')}</th>
                <th>{t('report.work')}</th>
                <th>{t('report.date')}</th>
                <th>{t('report.editedDateTime')}</th>
                <th>{t('report.day')}</th>
                <th>{t('report.workerName')}</th>
                <th>{t('report.workerId')}</th>
                <th>{t('report.siteEngineer')}</th>
                <th>{t('report.area')}</th>
                <th>{t('report.rate')}</th>
                <th>{t('report.cost')}</th>
                <th>{t('report.signature')}</th>
                <th>{t('report.remarks')}</th>
                <th>{t('report.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td>{record.site}</td>
                  <td>{record.work}</td>
                  <td>{record.date}</td>
                  <td>{record.updated_at || record.created_at}</td>
                  <td>{record.day}</td>
                  <td>{record.worker_name}</td>
                  <td>{record.worker_id}</td>
                  <td>{record.site_engineer}</td>
                  <td>{record.area}</td>
                  <td>{record.rate_id}</td>
                  <td>{record.cost}</td>
                  <td>{record.signature}</td>
                  <td>{record.remarks}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      {t('report.delete')}
                    </button>
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
