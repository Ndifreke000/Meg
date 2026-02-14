const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface Profile {
  id: string
  name: string
  role: string
  age?: number
  special_needs?: string[]
  created_at: string
}

export interface MoodLog {
  id: string
  profile_id: string
  mood: string
  energy_level?: number
  notes?: string
  logged_at: string
}

export interface Routine {
  id: string
  profile_id: string
  title: string
  description?: string
  scheduled_time: string
  duration_minutes?: number
  icon?: string
  completed: boolean
  created_at: string
}

export interface Activity {
  id: string
  profile_id: string
  activity_type: string
  title: string
  focus_score?: number
  duration_minutes?: number
  notes?: string
  logged_at: string
}

export interface MealPlan {
  id: string
  profile_id: string
  meal_type: string
  scheduled_time: string
  items: string[]
  calories?: number
  dietary_notes?: string
  created_at: string
}

export interface AIInsight {
  insight_type: string
  message: string
  confidence: number
  recommendations: string[]
}

export interface Analytics {
  profile_id: string
  period: string
  avg_mood_score: number
  avg_focus_score: number
  routines_completed: number
  total_activities: number
  trends: string[]
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/health')
  }

  // Profiles
  async createProfile(data: Omit<Profile, 'id' | 'created_at'>) {
    return this.request<Profile>('/profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProfiles() {
    return this.request<Profile[]>('/profiles')
  }

  // Mood tracking
  async logMood(data: Omit<MoodLog, 'id' | 'logged_at'>) {
    return this.request<MoodLog>('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMoodHistory(profileId: string) {
    return this.request<MoodLog[]>(`/mood/${profileId}`)
  }

  // Routines
  async createRoutine(data: Omit<Routine, 'id' | 'completed' | 'created_at'>) {
    return this.request<Routine>('/routines', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoutines(profileId: string) {
    return this.request<Routine[]>(`/routines/${profileId}`)
  }

  async updateRoutineStatus(routineId: string, completed: boolean) {
    return this.request<Routine>(`/routines/${routineId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ completed }),
    })
  }

  // Activities
  async logActivity(data: Omit<Activity, 'id' | 'logged_at'>) {
    return this.request<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getActivities(profileId: string) {
    return this.request<Activity[]>(`/activities/${profileId}`)
  }

  // Meal plans
  async createMealPlan(data: Omit<MealPlan, 'id' | 'created_at'>) {
    return this.request<MealPlan>('/meal-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMealPlans(profileId: string) {
    return this.request<MealPlan[]>(`/meal-plans/${profileId}`)
  }

  // AI insights
  async getAIInsights(profileId: string) {
    return this.request<AIInsight[]>(`/ai/insights/${profileId}`)
  }

  async getAnalytics(profileId: string) {
    return this.request<Analytics>(`/analytics/${profileId}`)
  }
}

export const api = new APIClient(API_BASE_URL)
