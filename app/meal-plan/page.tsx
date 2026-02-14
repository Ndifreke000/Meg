'use client'

export default function MealPlanPage() {
  const mealPlan = [
    {
      time: "7:00 AM",
      meal: "Breakfast",
      items: ["Oatmeal", "Fresh berries", "Almond milk"],
      calories: 350,
    },
    {
      time: "10:00 AM",
      meal: "Snack",
      items: ["Apple", "Almond butter"],
      calories: 150,
    },
    {
      time: "12:30 PM",
      meal: "Lunch",
      items: ["Grilled chicken", "Brown rice", "Steamed vegetables"],
      calories: 450,
    },
    {
      time: "3:00 PM",
      meal: "Snack",
      items: ["Yogurt", "Granola"],
      calories: 200,
    },
    {
      time: "6:30 PM",
      meal: "Dinner",
      items: ["Salmon", "Sweet potato", "Green salad"],
      calories: 550,
    },
  ]

  const dietaryRestrictions = [
    "Nut-free friendly",
    "Gluten-free options available",
    "Dairy alternatives provided",
    "Vegetarian alternatives",
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Meal Plan - Alex</h1>
          <p className="text-gray-600">Personalized nutrition plan with health recommendations</p>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Daily Calories</p>
            <p className="text-3xl font-bold text-gray-900">1,700 kcal</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Meals Today</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm mb-2">Water Intake Goal</p>
            <p className="text-3xl font-bold text-gray-900">8 glasses</p>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Meal Schedule</h2>
          <div className="space-y-4">
            {mealPlan.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{item.time}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{item.meal}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.items.map((foodItem, foodIdx) => (
                      <span key={foodIdx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {foodItem}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Dietary Preferences & Restrictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dietaryRestrictions.map((restriction, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-gray-700">{restriction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
            Generate New Plan
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}
