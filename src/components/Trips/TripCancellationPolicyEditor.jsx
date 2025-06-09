import React, { useState, useEffect } from 'react'

const policy_types = [
  { id: 0, name: 'refund' , display_name: 'استرداد كامل المبلغ'},
  { id: 1, name: 'refund_until' , display_name: 'استرداد كامل المبلغ قبل  '},
  { id: 2, name: 'no_refund' , display_name: 'لا استرداد للمبلغ'},
]

function TripCancellationPolicyEditor({onChange, intialPolicy = { type: 'refund', until: undefined }}) {

  const [selectedPolicyType, setSelectedPolicyType] = useState(policy_types.find(p => p.name === intialPolicy.type)?.id || 0)
  const [untilHours, setUntilHours] = useState(24)

  // Call onChange whenever the policy changes
  useEffect(() => {
    const selectedPolicy = policy_types.find(p => p.id === selectedPolicyType)
    const data = {
      type: selectedPolicy?.name,
      until: selectedPolicyType === 1 ? untilHours : undefined
    }
    onChange?.(data)
  }, [selectedPolicyType, untilHours])

  const handlePolicyTypeChange = (policyId) => {
    setSelectedPolicyType(policyId)
  }

  const handleHoursChange = (e) => {
    const hours = parseInt(e.target.value) || 0
    setUntilHours(hours)
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">سياسة إلغاء الرحلة</h3>
      
      <div className="space-y-3">
        {policy_types.map((policy) => (
          <div key={policy.id} className="flex items-center">
            <input
              type="radio"
              id={`policy-${policy.id}`}
              name="cancellation-policy"
              value={policy.id}
              checked={selectedPolicyType === policy.id}
              onChange={() => handlePolicyTypeChange(policy.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <label 
              htmlFor={`policy-${policy.id}`} 
              className="mr-3 text-sm font-medium text-gray-700 cursor-pointer flex-1"
            >
              {policy.display_name}
              {policy.id === 1 && selectedPolicyType === 1 && (
                <span className="inline-flex items-center mr-2">
                  <input
                    type="number"
                    value={untilHours}
                    onChange={handleHoursChange}
                    min="1"
                    max="168"
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mx-2"
                  />
                  <span className="text-sm text-gray-600">ساعة من موعد الرحلة</span>
                </span>
              )}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TripCancellationPolicyEditor