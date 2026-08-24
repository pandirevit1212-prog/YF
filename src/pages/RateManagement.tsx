import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Rate } from '../types'
import './RateManagement.css'

export function RateManagement() {
  const { t } = useTranslation()
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<Partial<Rate>>({
    name: '',
    value: 0,
    unit: 'm²',
    description: '',
  })

  useEffect(() => {
    checkAdminAndFetchRates()
  }, [])

  const checkAdminAndFetchRates = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setIsAdmin(user.user_metadata?.role === 'admin')
      await fetchRates()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchRates = async () => {
    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('rates')
        .select('*')
        .order('name', { ascending: true })

      if (queryError) throw queryError
      setRates(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'number' ? parseFloat(value) || 0 : value
    setFormData(prev => ({ ...prev, [name]: newValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (editingId) {
        const { error: updateError } = await supabase
          .from('rates')
          .update(formData)
          .eq('id', editingId)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('rates')
          .insert([{ ...formData, created_by: user.id }])

        if (insertError) throw insertError
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', value: 0, unit: 'm²', description: '' })
      await fetchRates()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (rate: Rate) => {
    setFormData(rate)
    setEditingId(rate.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('rates.confirmDelete'))) return

    setLoading(true)
    try {
      const { error: deleteError } = await supabase
        .from('rates')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      await fetchRates()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('rates.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return <div className="empty-state">{t('rates.adminOnly')}</div>
  }

  return (
    <div className="rates-container">
      <div className="rates-header">
        <h2>{t('rates.title')}</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', value: 0, unit: 'm²', description: '' })
          }}
        >
          {t('rates.add')}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{editingId ? t('rates.success') : t('rates.success')}</div>}

      {showForm && (
        <div className="rate-form card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">{t('rates.name')} *</label>
              <input
                type="text"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label">{t('rates.value')} *</label>
              <input
                type="number"
                name="value"
                className="input"
                value={formData.value}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label">{t('rates.unit')}</label>
              <input
                type="text"
                name="unit"
                className="input"
                value={formData.unit}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label">{t('rates.description')}</label>
              <textarea
                name="description"
                className="textarea"
                value={formData.description}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? t('common.loading') : t('common.save')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ name: '', value: 0, unit: 'm²', description: '' })
                }}
                disabled={loading}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rates-list">
        {loading && !showForm ? (
          <div className="loading">{t('common.loading')}</div>
        ) : rates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">{t('rates.noneFound')}</div>
            <div className="empty-state-text">{t('rates.createFirst')}</div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('rates.name')}</th>
                <th>{t('rates.value')}</th>
                <th>{t('rates.unit')}</th>
                <th>{t('rates.description')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(rate => (
                <tr key={rate.id}>
                  <td>{rate.name}</td>
                  <td>{rate.value}</td>
                  <td>{rate.unit}</td>
                  <td>{rate.description}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(rate)}
                      disabled={loading}
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(rate.id)}
                      disabled={loading}
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
