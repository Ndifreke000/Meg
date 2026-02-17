'use client'

import { useState } from 'react'
import { useProfiles, useCreateProfile } from '@/hooks/use-api'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileForm {
  name: string
  role: string
  age?: number
  special_needs: string
}

export default function ProfilesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: profiles, isLoading } = useProfiles()
  const createProfile = useCreateProfile()
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>()

  const onSubmit = async (data: ProfileForm) => {
    try {
      const validAge = data.age && !isNaN(data.age) ? data.age : undefined
      await createProfile.mutateAsync({
        name: data.name,
        role: data.role,
        age: validAge,
        special_needs: data.special_needs ? data.special_needs.split(',').map(s => s.trim()) : undefined,
      })
      toast.success('Profile created successfully!')
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      toast.error('Failed to create profile')
    }
  }

  const setupItems = [
    { label: 'Health & Medical Info', completed: true },
    { label: 'School & Educational', completed: true },
    { label: 'Therapies & Support', completed: false },
    { label: 'Emergency Contacts', completed: true },
    { label: 'Dietary Preferences', completed: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profiles & Setup</h1>
          <p className="text-gray-600">Manage family members and system configuration</p>
        </div>

        {/* User Profiles */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Family Profiles</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : profiles && profiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile) => (
                <div key={profile.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">
                        {profile.role === 'child' ? '👦' : '👨‍👩‍👧'}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{profile.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                        {profile.age && <p className="text-xs text-gray-400">{profile.age} years old</p>}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  
                  {profile.special_needs && profile.special_needs.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Special Needs:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.special_needs.map((need, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Created {(() => {
                      try {
                        return new Date(profile.created_at).toLocaleDateString()
                      } catch {
                        return 'Date unavailable'
                      }
                    })()}
                  </p>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">No profiles yet</p>
              <p className="text-sm text-gray-400">Create your first profile to get started</p>
            </div>
          )}
        </div>

        {/* Setup Checklist */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Setup Checklist</h2>
          <div className="space-y-3">
            {setupItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  item.completed 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300"
                }`}>
                  {item.completed && "✓"}
                </div>
                <span className={item.completed ? "line-through text-gray-500" : "text-gray-900"}>
                  {item.label}
                </span>
                {!item.completed && (
                  <button className="ml-auto text-blue-600 text-sm font-semibold hover:underline">
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Enter name"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  {...register('role', { required: 'Role is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select role</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="clinician">Clinician</option>
                </select>
                {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { valueAsNumber: true })}
                  placeholder="Enter age"
                />
              </div>

              <div>
                <Label htmlFor="special_needs">Special Needs (comma-separated)</Label>
                <Input
                  id="special_needs"
                  {...register('special_needs')}
                  placeholder="e.g., ADHD, Autism, Sensory Processing"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProfile.isPending}
                  className="flex-1"
                >
                  {createProfile.isPending ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
