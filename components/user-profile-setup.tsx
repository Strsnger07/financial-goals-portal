"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/lib/smart-recommendations"
import { User, DollarSign, CreditCard, PiggyBank, MapPin, Briefcase, Calendar } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface UserProfileSetupProps {
  onProfileComplete: (profile: UserProfile) => void
  initialProfile?: Partial<UserProfile>
}

export function UserProfileSetup({ onProfileComplete, initialProfile }: UserProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>({
    age: initialProfile?.age || 25,
    income: initialProfile?.income || 0,
    expenses: initialProfile?.expenses || 0,
    debt: initialProfile?.debt || 0,
    savings: initialProfile?.savings || 0,
    lifeEvents: initialProfile?.lifeEvents || [],
    riskTolerance: initialProfile?.riskTolerance || 'moderate',
    location: initialProfile?.location || '',
    occupation: initialProfile?.occupation || ''
  })
  const { currency } = useCurrency()

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      onProfileComplete(profile)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.age > 0 && profile.income > 0
      case 2:
        return profile.expenses > 0
      case 3:
        return profile.riskTolerance
      case 4:
        return profile.location && profile.occupation
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Basic Information"
      case 2: return "Financial Overview"
      case 3: return "Risk Profile"
      case 4: return "Personal Details"
      default: return ""
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Tell us about your age and income to get personalized recommendations"
      case 2: return "Help us understand your current financial situation"
      case 3: return "Your risk tolerance helps us suggest appropriate investment goals"
      case 4: return "Final details to complete your profile"
      default: return ""
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber === step 
                ? 'bg-blue-600 text-white' 
                : stepNumber < step 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber < step ? '✓' : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                stepNumber < step ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>{getStepTitle()}</span>
          </CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                    placeholder="25"
                  />
                </div>
                             <div className="space-y-2">
               <Label htmlFor="income">Annual Income ({currency})</Label>
               <div className="relative">
                 <span className="absolute left-3 top-3 text-gray-400 font-medium">{currency}</span>
                 <Input
                   id="income"
                   type="number"
                   value={profile.income}
                   onChange={(e) => updateProfile('income', parseInt(e.target.value))}
                   placeholder="500000"
                   className="pl-8"
                 />
               </div>
             </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
                           <div className="space-y-2">
               <Label htmlFor="expenses">Monthly Expenses ({currency})</Label>
               <div className="relative">
                 <span className="absolute left-3 top-3 text-gray-400 font-medium">{currency}</span>
                 <Input
                   id="expenses"
                   type="number"
                   value={profile.expenses}
                   onChange={(e) => updateProfile('expenses', parseInt(e.target.value))}
                   placeholder="30000"
                   className="pl-8"
                 />
               </div>
             </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debt">Total Debt ({currency})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-medium">{currency}</span>
                    <Input
                      id="debt"
                      type="number"
                      value={profile.debt}
                      onChange={(e) => updateProfile('debt', parseInt(e.target.value))}
                      placeholder="150000"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="savings">Current Savings ({currency})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-medium">{currency}</span>
                    <Input
                      id="savings"
                      type="number"
                      value={profile.savings}
                      onChange={(e) => updateProfile('savings', parseInt(e.target.value))}
                      placeholder="50000"
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={profile.riskTolerance} onValueChange={(value) => updateProfile('riskTolerance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your risk tolerance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">
                      <div className="flex items-center space-x-2">
                        <span>🛡️ Conservative</span>
                        <Badge variant="secondary">Low Risk</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <div className="flex items-center space-x-2">
                        <span>⚖️ Moderate</span>
                        <Badge variant="secondary">Balanced</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="aggressive">
                      <div className="flex items-center space-x-2">
                        <span>🚀 Aggressive</span>
                        <Badge variant="secondary">High Risk</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What this means:</h4>
                {profile.riskTolerance === 'conservative' && (
                  <p className="text-sm text-blue-800">
                    You prefer stable, low-risk investments with predictable returns. 
                    We'll suggest goals focused on capital preservation and steady growth.
                  </p>
                )}
                {profile.riskTolerance === 'moderate' && (
                  <p className="text-sm text-blue-800">
                    You're comfortable with some risk for better returns. 
                    We'll suggest a balanced mix of conservative and growth-oriented goals.
                  </p>
                )}
                {profile.riskTolerance === 'aggressive' && (
                  <p className="text-sm text-blue-800">
                    You're willing to take higher risks for potentially higher returns. 
                    We'll suggest growth-focused investment goals and opportunities.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => updateProfile('location', e.target.value)}
                    placeholder="City, State"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="occupation"
                    value={profile.occupation}
                    onChange={(e) => updateProfile('occupation', e.target.value)}
                    placeholder="Software Engineer"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step === 4 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 