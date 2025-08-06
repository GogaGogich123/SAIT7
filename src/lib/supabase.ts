import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Cadet {
  id: string
  auth_user_id?: string
  name: string
  email: string
  phone?: string
  platoon: string
  squad: number
  avatar_url?: string
  rank?: number
  total_score?: number
  join_date?: string
  created_at?: string
  updated_at?: string
}

export interface Score {
  id: string
  cadet_id: string
  study_score?: number
  discipline_score?: number
  events_score?: number
  created_at?: string
  updated_at?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  category: string
  icon?: string
  color?: string
  created_at?: string
}

export interface AutoAchievement {
  id: string
  title: string
  description: string
  icon?: string
  color?: string
  requirement_type: string
  requirement_value: number
  requirement_category?: string
  created_at?: string
}

export interface CadetAchievement {
  id: string
  cadet_id: string
  achievement_id?: string
  auto_achievement_id?: string
  awarded_date?: string
  awarded_by?: string
}

export interface Task {
  id: string
  title: string
  description: string
  category: 'study' | 'discipline' | 'events'
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  deadline: string
  status?: 'active' | 'inactive'
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface TaskSubmission {
  id: string
  task_id: string
  cadet_id: string
  status?: 'taken' | 'submitted' | 'completed' | 'rejected'
  submission_text?: string
  submitted_at?: string
  reviewed_at?: string
  reviewed_by?: string
  feedback?: string
  points_awarded?: number
  created_at?: string
  updated_at?: string
}

export interface News {
  id: string
  title: string
  content: string
  author: string
  is_main?: boolean
  background_image_url?: string
  images?: any[]
  created_by?: string
  created_at?: string
  updated_at?: string
}

export interface ScoreHistory {
  id: string
  cadet_id: string
  category: 'study' | 'discipline' | 'events'
  points: number
  description: string
  awarded_by?: string
  created_at?: string
}

export interface User {
  id: string
  email: string
  password_hash: string
  role: 'admin' | 'cadet'
  name: string
  created_at?: string
  updated_at?: string
}

// Auth functions
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signUpUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Cadet functions
export const getCadets = async () => {
  const { data, error } = await supabase
    .from('cadets')
    .select('*')
    .order('total_score', { ascending: false })
  return { data, error }
}

export const getCadetById = async (id: string) => {
  const { data, error } = await supabase
    .from('cadets')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const getCadetByAuthId = async (authId: string) => {
  const { data, error } = await supabase
    .from('cadets')
    .select('*')
    .eq('auth_user_id', authId)
    .single()
  return { data, error }
}

export const updateCadet = async (id: string, updates: Partial<Cadet>) => {
  const { data, error } = await supabase
    .from('cadets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Score functions
export const getScores = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
  return { data, error }
}

export const getScoresByCadetId = async (cadetId: string) => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('cadet_id', cadetId)
    .single()
  return { data, error }
}

export const updateScore = async (cadetId: string, updates: Partial<Score>) => {
  const { data, error } = await supabase
    .from('scores')
    .upsert({ cadet_id: cadetId, ...updates })
    .select()
    .single()
  return { data, error }
}

// Achievement functions
export const getAchievements = async () => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
  return { data, error }
}

export const getAutoAchievements = async () => {
  const { data, error } = await supabase
    .from('auto_achievements')
    .select('*')
  return { data, error }
}

export const getCadetAchievements = async (cadetId: string) => {
  const { data, error } = await supabase
    .from('cadet_achievements')
    .select(`
      *,
      achievements(*),
      auto_achievements(*)
    `)
    .eq('cadet_id', cadetId)
  return { data, error }
}

export const awardAchievement = async (cadetId: string, achievementId: string, awardedBy?: string) => {
  const { data, error } = await supabase
    .from('cadet_achievements')
    .insert({
      cadet_id: cadetId,
      achievement_id: achievementId,
      awarded_by: awardedBy
    })
    .select()
    .single()
  return { data, error }
}

// Task functions
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'active')
    .order('deadline', { ascending: true })
  return { data, error }
}

export const getTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  return { data, error }
}

// Task submission functions
export const getTaskSubmissions = async (cadetId?: string) => {
  let query = supabase
    .from('task_submissions')
    .select(`
      *,
      tasks(*),
      cadets(name, platoon, squad)
    `)

  if (cadetId) {
    query = query.eq('cadet_id', cadetId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const getTaskSubmission = async (taskId: string, cadetId: string) => {
  const { data, error } = await supabase
    .from('task_submissions')
    .select('*')
    .eq('task_id', taskId)
    .eq('cadet_id', cadetId)
    .single()
  return { data, error }
}

export const createTaskSubmission = async (submission: Omit<TaskSubmission, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('task_submissions')
    .insert(submission)
    .select()
    .single()
  return { data, error }
}

export const updateTaskSubmission = async (id: string, updates: Partial<TaskSubmission>) => {
  const { data, error } = await supabase
    .from('task_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// News functions
export const getNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getMainNews = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('is_main', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return { data, error }
}

export const createNews = async (news: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single()
  return { data, error }
}

// Score history functions
export const getScoreHistory = async (cadetId?: string) => {
  let query = supabase
    .from('score_history')
    .select(`
      *,
      cadets(name, platoon, squad)
    `)

  if (cadetId) {
    query = query.eq('cadet_id', cadetId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

export const addScoreHistory = async (history: Omit<ScoreHistory, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('score_history')
    .insert(history)
    .select()
    .single()
  return { data, error }
}

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  return { data, error }
}

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

// Utility functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  return { data, error }
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}