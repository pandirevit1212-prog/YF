export interface SiteWork {
  id: string
  site: string
  work: string
  date: string
  day: number
  worker_name: string
  worker_id: string
  site_engineer: string
  area: number
  rate_id: string
  cost: number
  signature: string
  remarks: string
  created_by: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Rate {
  id: string
  name: string
  value: number
  unit: string
  description: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface EditHistory {
  id: string
  record_id: string
  record_type: 'site_work' | 'rate'
  action: 'create' | 'update' | 'delete'
  old_values: Record<string, any>
  new_values: Record<string, any>
  edited_by: string
  edited_at: string
  user_email: string
}

export interface DeletedRecord {
  id: string
  record_id: string
  record_type: 'site_work' | 'rate'
  data: SiteWork | Rate
  deleted_by: string
  deleted_at: string
  user_email: string
}

export interface User {
  id: string
  email: string
  full_name: string
  employee_id: string
  role: 'admin' | 'user'
  created_at: string
}
