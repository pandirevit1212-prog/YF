import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { SiteWork, Rate } from '../types'
import './EntryForm.css'

export function SiteWorkEntry() {
  const { t } = useTranslation()
  const [sites, setSites] = useState<string[]>([])
  const [works, setWorks] = useState<string[]>([])
  const [rates, setRates] = useState<Rate[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoCalculate, setAutoCalculate] = useState(true)

  const [formData, setFormData] = useState<Partial<SiteWork>>({
    site: '',
    work: '',
    date: new Date().toISOString().split('T')[0],
    day: 1,
    worker_name: '',
    worker_id: '',
    site_engineer: '',
    area: 0,
    rate_id: '',
    cost: 0,
    signature: '',
    remarks: '',
  })

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      // Fetch unique sites and works from existing records
      const { data: records } = await supabase
        .from('site_works')
        .select('site, work')
        .order('created_at', { ascending: false })

      if (records) {
        const uniqueSites = [...new Set(records.map(r => r.site))]
        const uniqueWorks = [...new Set(records.map(r => r.work))]
        setSites(uniqueSites)
        setWorks(uniqueWorks)
      }

      // Fetch rates
      const { data: ratesData } = await supabase
        .from('rates')
        .select('*')
        .order('name', { ascending: true })

      if (ratesData) {
        setRates(ratesData)
      }
    } catch (err) {
      console.error('Error fetching initial data:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'number' ? parseFloat(value) || 0 : value

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue }

      // Auto-calculate cost if enabled
      if (autoCalculate && name === 'area' && updated.rate_id) {
        const selectedRate = rates.find(r => r.id === updated.rate_id)
        if (selectedRate) {
          updated.cost = (updated.area as number) * selectedRate.value
        }
      }

      if (autoCalculate && name === 'rate_id') {
        const selectedRate = rates.find(r => r.id === updated.rate_id)
        if (selectedRate && updated.area) {
          updated.cost = (updated.area as number) * selectedRate.value
        }
      }

      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error: insertError } = await supabase
        .from('site_works')
        .insert([{
          ...formData,
          created_by: user.id,
          updated_by: user.id,
        }])

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      // Reset form
      setFormData({
        site: '',
        work: '',
        date: new Date().toISOString().split('T')[0],
        day: 1,
        worker_name: '',
        worker_id: '',
        site_engineer: '',
        area: 0,
        rate_id: '',
        cost: 0,
        signature: '',
        remarks: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="entry-container">
      <h2>{t('entry.title')}</h2>

      {success && <div className="success-message">{t('entry.success')}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="entry-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="label">{t('entry.site')} *</label>
            <input
              list="sites-list"
              type="text"
              name="site"
              className="input"
              value={formData.site}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <datalist id="sites-list">
              {sites.map(site => <option key={site} value={site} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label className="label">{t('entry.work')} *</label>
            <input
              list="works-list"
              type="text"
              name="work"
              className="input"
              value={formData.work}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <datalist id="works-list">
              {works.map(work => <option key={work} value={work} />)}
            </datalist>
          </div>

          <div className="form-group">
            <label className="label">{t('entry.date')} *</label>
            <input
              type="date"
              name="date"
              className="input"
              value={formData.date}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.day')}</label>
            <input
              type="number"
              name="day"
              className="input"
              value={formData.day}
              onChange={handleInputChange}
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.workerName')} *</label>
            <input
              type="text"
              name="worker_name"
              className="input"
              value={formData.worker_name}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.workerId')} *</label>
            <input
              type="text"
              name="worker_id"
              className="input"
              value={formData.worker_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.siteEngineer')}</label>
            <input
              type="text"
              name="site_engineer"
              className="input"
              value={formData.site_engineer}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.area')}</label>
            <input
              type="number"
              name="area"
              className="input"
              value={formData.area}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.rate')} *</label>
            <select
              name="rate_id"
              className="select"
              value={formData.rate_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">{t('entry.selectRate')}</option>
              {rates.map(rate => (
                <option key={rate.id} value={rate.id}>
                  {rate.name} ({rate.value}/{rate.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">{t('entry.cost')}</label>
            <input
              type="number"
              name="cost"
              className="input"
              value={formData.cost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="label">{t('entry.signature')}</label>
            <input
              type="text"
              name="signature"
              className="input"
              value={formData.signature}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={autoCalculate}
              onChange={(e) => setAutoCalculate(e.target.checked)}
              disabled={loading}
            />
            {t('entry.autoCalculate')}
          </label>
        </div>

        <div className="form-group">
          <label className="label">{t('entry.remarks')}</label>
          <textarea
            name="remarks"
            className="textarea"
            value={formData.remarks}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? t('common.loading') : t('entry.submit')}
          </button>
          <button
            type="reset"
            className="btn btn-secondary"
            onClick={() => {
              setFormData({
                site: '',
                work: '',
                date: new Date().toISOString().split('T')[0],
                day: 1,
                worker_name: '',
                worker_id: '',
                site_engineer: '',
                area: 0,
                rate_id: '',
                cost: 0,
                signature: '',
                remarks: '',
              })
            }}
            disabled={loading}
          >
            {t('entry.reset')}
          </button>
        </div>
      </form>
    </div>
  )
}
