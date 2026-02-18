import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Profile, MoodLog, Routine, Activity, MealPlan, AIInsight, Analytics, Guardian } from '@/lib/api'

// Profiles (alias for children)
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => api.getChildren(),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Profile, 'id' | 'created_at'>) => api.createChild(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
    },
  })
}

// Mood tracking
export function useMoodHistory(childId: string | undefined) {
  return useQuery({
    queryKey: ['mood', childId],
    queryFn: () => childId ? api.getMoodHistory(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
  })
}

export function useLogMood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<MoodLog, 'id' | 'logged_at'>) => api.logMood(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mood', variables.child_id] })
      queryClient.invalidateQueries({ queryKey: ['analytics', variables.child_id] })
    },
  })
}

// Routines
export function useRoutines(childId: string | undefined) {
  return useQuery({
    queryKey: ['routines', childId],
    queryFn: () => childId ? api.getRoutines(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
  })
}

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Routine, 'id' | 'completed' | 'created_at'>) => api.createRoutine(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routines', variables.child_id] })
    },
  })
}

export function useUpdateRoutineStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ routineId, completed }: { routineId: string; completed: boolean }) =>
      api.updateRoutineStatus(routineId, completed),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['routines', data.child_id] })
      queryClient.invalidateQueries({ queryKey: ['analytics', data.child_id] })
    },
  })
}

// Activities
export function useActivities(childId: string | undefined) {
  return useQuery({
    queryKey: ['activities', childId],
    queryFn: () => childId ? api.getActivities(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
  })
}

export function useLogActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Activity, 'id' | 'logged_at'>) => api.logActivity(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activities', variables.child_id] })
      queryClient.invalidateQueries({ queryKey: ['analytics', variables.child_id] })
    },
  })
}

// Meal plans
export function useMealPlans(childId: string | undefined) {
  return useQuery({
    queryKey: ['meal-plans', childId],
    queryFn: () => childId ? api.getMealPlans(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
  })
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<MealPlan, 'id' | 'created_at'>) => api.createMealPlan(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meal-plans', variables.child_id] })
    },
  })
}

// AI insights
export function useAIInsights(childId: string | undefined) {
  return useQuery({
    queryKey: ['insights', childId],
    queryFn: () => childId ? api.getAIInsights(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Analytics
export function useAnalytics(childId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', childId],
    queryFn: () => childId ? api.getAnalytics(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Guardians
export function useGuardians(childId: string | undefined) {
  return useQuery({
    queryKey: ['guardians', childId],
    queryFn: () => childId ? api.getGuardians(childId) : Promise.reject(new Error('No child ID provided')),
    enabled: !!childId,
  })
}

export function useCreateGuardian() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Guardian, 'id' | 'created_at'>) => api.createGuardian(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['guardians', variables.child_id] })
    },
  })
}
