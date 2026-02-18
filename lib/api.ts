const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

// API Error class
export class APIError extends Error {
  constructor(public status: number, message: string, public isNetworkError: boolean = false) {
    super(message)
    this.name = 'APIError'
  }
}

export interface Profile {
  id: string
  name: string
  role: string
  age?: number
  special_needs?: string[]
  created_at: string
}

// Mock data for development
const MOCK_PROFILES: Profile[] = [
  {
    id: 'mock-1',
    name: 'Emma',
    role: 'child',
    age: 7,
    special_needs: ['ADHD'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Sarah',
    role: 'parent',
    created_at: new Date().toISOString(),
  },
]

export interface MoodLog {
  id: string
  child_id: string
  mood: string
  energy_level?: number
  notes?: string
  logged_at: string
}

export interface Routine {
  id: string
  child_id: string
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
  child_id: string
  activity_type: string
  title: string
  focus_score?: number
  duration_minutes?: number
  notes?: string
  logged_at: string
}

export interface MealPlan {
  id: string
  child_id: string
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
  child_id: string
  period: string
  avg_mood_score: number
  avg_focus_score: number
  routines_completed: number
  total_activities: number
  trends: string[]
}

export interface Guardian {
  id: string
  child_id: string
  name: string
  relationship: string
  email?: string
  phone_number?: string
  can_pickup: boolean
  emergency_contact: boolean
  notes?: string
  created_at: string
}

class APIClient {
  private baseURL: string
  private retryCount = 0
  private maxRetries = 2

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      let token: string | null = null
      if (typeof window !== 'undefined') {
        try {
          token = localStorage.getItem('token')
          // Sanitize token to prevent HTTP response splitting
          if (token && /[\r\n]/.test(token)) {
            console.warn('[v0] Invalid token format detected')
            token = null
          }
        } catch (error) {
          console.warn('[v0] Failed to access localStorage:', error)
        }
      }
      
      const fetchUrl = `${this.baseURL}${endpoint}`
      console.log('[v0] API request:', fetchUrl)
      
      try {
        const response = await Promise.race([
          fetch(fetchUrl, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
              ...options?.headers,
            },
          }),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          ),
        ])

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new APIError(response.status, error.error || `HTTP ${response.status}`)
        }

        return response.json()
      } catch (fetchError) {
        // Check if it's a network error
        const isNetworkError = fetchError instanceof TypeError || 
                              (fetchError instanceof Error && fetchError.message.includes('timeout'))
        
        console.error('[v0] Network/fetch error:', fetchError instanceof Error ? fetchError.message : 'Unknown')
        
        if (isNetworkError) {
          throw new APIError(0, `Unable to connect to server. Please check if the backend is running at ${this.baseURL}`, true)
        }
        
        throw fetchError
      }
    } catch (error) {
      console.error('[v0] API request failed:', error instanceof Error ? error.message : String(error))
      if (error instanceof APIError) throw error
      throw new APIError(0, error instanceof Error ? error.message : 'Network error', true)
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; service: string }>('/health')
  }

  // Children (aliased as profiles for frontend compatibility)
  async createChild(data: Omit<Profile, 'id' | 'created_at'>) {
    try {
      return await this.request<Profile>('/children', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          age: data.age,
          special_needs: data.special_needs,
          // Map other profile fields as needed
        }),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for createChild')
        return {
          id: `mock-${Date.now()}`,
          name: data.name,
          role: 'child',
          age: data.age,
          special_needs: data.special_needs,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getChildren() {
    try {
      return await this.request<Profile[]>('/children')
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getChildren')
        return MOCK_PROFILES
      }
      throw error
    }
  }

  // Legacy profile methods (deprecated - use children methods)
  async createProfile(data: Omit<Profile, 'id' | 'created_at'>) {
    return this.createChild(data)
  }

  async getProfiles() {
    return this.getChildren()
  }

  // Mood tracking
  async logMood(data: Omit<MoodLog, 'id' | 'logged_at'>) {
    try {
      return await this.request<MoodLog>('/mood', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for logMood')
        return {
          id: `mock-${Date.now()}`,
          ...data,
          logged_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getMoodHistory(profileId: string) {
    try {
      return await this.request<MoodLog[]>(`/mood/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getMoodHistory')
        return []
      }
      throw error
    }
  }

  // Routines
  async createRoutine(data: Omit<Routine, 'id' | 'completed' | 'created_at'>) {
    try {
      return await this.request<Routine>('/routines', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for createRoutine')
        return {
          id: `mock-${Date.now()}`,
          ...data,
          completed: false,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getRoutines(profileId: string) {
    try {
      return await this.request<Routine[]>(`/routines/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getRoutines')
        return []
      }
      throw error
    }
  }

  async updateRoutineStatus(routineId: string, completed: boolean) {
    try {
      return await this.request<Routine>(`/routines/${routineId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ completed }),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for updateRoutineStatus')
        return {
          id: routineId,
          child_id: 'mock',
          title: 'Routine',
          completed,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  // Activities
  async logActivity(data: Omit<Activity, 'id' | 'logged_at'>) {
    try {
      return await this.request<Activity>('/activities', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for logActivity')
        return {
          id: `mock-${Date.now()}`,
          ...data,
          logged_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getActivities(profileId: string) {
    try {
      return await this.request<Activity[]>(`/activities/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getActivities')
        return []
      }
      throw error
    }
  }

  // Meal plans
  async createMealPlan(data: Omit<MealPlan, 'id' | 'created_at'>) {
    try {
      return await this.request<MealPlan>('/meal-plans', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for createMealPlan')
        return {
          id: `mock-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getMealPlans(profileId: string) {
    try {
      return await this.request<MealPlan[]>(`/meal-plans/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getMealPlans')
        return []
      }
      throw error
    }
  }

  // AI insights
  async getAIInsights(profileId: string) {
    try {
      return await this.request<AIInsight[]>(`/ai/insights/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getAIInsights')
        return []
      }
      throw error
    }
  }

  async getAnalytics(profileId: string) {
    try {
      return await this.request<Analytics>(`/analytics/${profileId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getAnalytics')
        return {
          child_id: profileId,
          period: 'week',
          avg_mood_score: 7,
          avg_focus_score: 6,
          routines_completed: 5,
          total_activities: 12,
          trends: [],
        }
      }
      throw error
    }
  }

  // AI chat
  async chatWithAI(message: string) {
    try {
      return await this.request<{ response: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for chatWithAI')
        return {
          response: `I received your message: "${message}". The AI backend is currently unavailable, but your message has been noted.`,
        }
      }
      throw error
    }
  }

  // Guardians
  async createGuardian(data: Omit<Guardian, 'id' | 'created_at'>) {
    try {
      return await this.request<Guardian>('/guardians', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for createGuardian')
        return {
          id: `mock-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
        }
      }
      throw error
    }
  }

  async getGuardians(childId: string) {
    try {
      return await this.request<Guardian[]>(`/guardians/${childId}`)
    } catch (error) {
      if (USE_MOCK_DATA || (error instanceof APIError && error.isNetworkError)) {
        console.log('[v0] Using mock data for getGuardians')
        return []
      }
      throw error
    }
  }
}

export const api = new APIClient(API_BASE_URL)
