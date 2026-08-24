import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    employee_id?: string
    role?: 'admin' | 'user'
  }
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function register(
  email: string,
  password: string,
  fullName: string,
  employeeId: string,
  role: 'admin' | 'user' = 'user'
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        employee_id: employeeId,
        role,
      },
    },
  })

  if (error) throw error
  return data
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw error
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function updateUserProfile(
  fullName: string,
  employeeId: string,
  role: 'admin' | 'user'
) {
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      employee_id: employeeId,
      role,
    },
  })
  if (error) throw error
}
