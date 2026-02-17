'use client'

import { useCurrentProfile } from '@/lib/profile-context'
import { useMealPlans, useCreateMealPlan } from '@/hooks/use-api'
import { useState } from 'react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'

interface MealPlanForm {
  meal_type: string
  scheduled_time: string
  items: string
  calories?: number
  dietary_notes?: string
}

export default function MealPlanPage() {
  const { currentProfileId } = useCurrentProfile()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const { data: mealPlans, isLoading } = useMealPlans(currentProfileId)
  const createMealPlan = useCreateMealPlan()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MealPlanForm>()

  const onSubmit = async (data: MealPlanForm) => {
    if (!currentProfileId) {
      toast.error('No profile selected')
      return
    }

    try {
      await createMealPlan.mutateAsync({
        child_id: currentProfileId,
        meal_type: data.meal_type,
        scheduled_time: data.scheduled_time,
        items: data.items.split(',').map(item => item.trim()),
        calories: data.calories,
        dietary_notes: data.dietary_notes
      })
      toast.success('Meal plan created successfully!')
      setIsDialogOpen(false)
      reset()
    } catch (error) {
      toast.error('Failed to create meal plan')
    }
  }

  const generateAIPlan = async () => {
    if (!currentProfileId) {
      toast.error('No profile selected')
      return
    }

    const aiMeals = [
      { meal_type: 'Breakfast', scheduled_time: '07:00', items: ['Oatmeal', 'Fresh berries', 'Almond milk'], calories: 350 },
      { meal_type: 'Snack', scheduled_time: '10:00', items: ['Apple', 'Almond butter'], calories: 150 },
      { meal_type: 'Lunch', scheduled_time: '12:30', items: ['Grilled chicken', 'Brown rice', 'Steamed vegetables'], calories: 450 },
      { meal_type: 'Snack', scheduled_time: '15:00', items: ['Yogurt', 'Granola'], calories: 200 },
      { meal_type: 'Dinner', scheduled_time: '18:30', items: ['Salmon', 'Sweet potato', 'Green salad'], calories: 550 }
    ]

    try {
      for (const meal of aiMeals) {
        await createMealPlan.mutateAsync({
          child_id: currentProfileId,
          ...meal
        })
      }
      toast.success('AI meal plan generated successfully!')
    } catch (error) {
      toast.error('Failed to generate meal plan')
    }
  }

  if (!currentProfileId) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Profile Selected</h1>
          <p className="text-gray-600 mb-6">Please select a profile to view meal plans</p>
          <a href="/profiles" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Profiles
          </a>
        </div>
      </div>
    )
  }

  const totalCalories = mealPlans?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0
  const mealCount = mealPlans?.length || 0

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Meal Plan</h1>
          <p className="text-gray-600">Personalized nutrition plan with health recommendations</p>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Daily Calories</p>
            <p className="text-3xl font-bold text-gray-900">{totalCalories} kcal</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Meals Today</p>
            <p className="text-3xl font-bold text-gray-900">{mealCount}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Water Intake Goal</p>
            <p className="text-3xl font-bold text-gray-900">8 glasses</p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Meal Schedule</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : mealPlans && mealPlans.length > 0 ? (
            <div className="space-y-4">
              {mealPlans.map((meal) => (
                <div key={meal.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{meal.scheduled_time}</p>
                    <h3 className="font-bold text-gray-900 mb-2">{meal.meal_type}</h3>
                    <div className="flex flex-wrap gap-2">
                      {meal.items.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                    {meal.dietary_notes && (
                      <p className="text-xs text-gray-500 mt-2">{meal.dietary_notes}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{meal.calories || 0}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No meal plans yet</p>
              <p className="text-sm text-gray-400">Create a meal plan or generate one with AI</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={generateAIPlan}
            disabled={createMealPlan.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createMealPlan.isPending ? 'Generating...' : 'Generate AI Plan'}
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Custom Meal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Meal Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="meal_type">Meal Type *</Label>
                  <select
                    id="meal_type"
                    {...register('meal_type', { required: 'Meal type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select meal type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                  {errors.meal_type && <p className="text-sm text-red-600 mt-1">{errors.meal_type.message}</p>}
                </div>

                <div>
                  <Label htmlFor="scheduled_time">Time *</Label>
                  <Input
                    id="scheduled_time"
                    type="time"
                    {...register('scheduled_time', { required: 'Time is required' })}
                  />
                  {errors.scheduled_time && <p className="text-sm text-red-600 mt-1">{errors.scheduled_time.message}</p>}
                </div>

                <div>
                  <Label htmlFor="items">Food Items (comma-separated) *</Label>
                  <Input
                    id="items"
                    {...register('items', { required: 'Items are required' })}
                    placeholder="e.g., Oatmeal, Berries, Milk"
                  />
                  {errors.items && <p className="text-sm text-red-600 mt-1">{errors.items.message}</p>}
                </div>

                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    {...register('calories', { valueAsNumber: true })}
                    placeholder="350"
                  />
                </div>

                <div>
                  <Label htmlFor="dietary_notes">Dietary Notes</Label>
                  <Input
                    id="dietary_notes"
                    {...register('dietary_notes')}
                    placeholder="Any special notes or restrictions"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMealPlan.isPending} className="flex-1">
                    {createMealPlan.isPending ? 'Creating...' : 'Create Meal'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
