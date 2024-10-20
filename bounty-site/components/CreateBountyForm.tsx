"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { DollarSign, Calendar, Tags } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createPayment } from "@/lib/flouciApi"

export default function CreateBountyForm() {
  const { user } = useUser()
  const createBounty = useMutation(api.bounties.create)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    tags: "",
    communicationMethod: "discord",
    communicationValue: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCommunicationMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, communicationMethod: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be logged in to create a bounty")
      return
    }
    try {
      // First, create the bounty
      const bountyId = await createBounty({
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        poster: {
          id: user.id,
          name: user.fullName || "",
          avatar: user.imageUrl,
        },
        communicationMethod: formData.communicationMethod,
        communicationValue: formData.communicationValue,
        status: 'pending_payment',
      })

      // Then, create a payment
      const payment = await createPayment(parseFloat(formData.amount) * 100, bountyId)

      // Redirect to Flouci payment page
      window.location.href = payment.payment_url
    } catch (error) {
      console.error("Failed to create bounty or initiate payment:", error)
      alert("Failed to create bounty or initiate payment")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create a New Bounty</CardTitle>
        <CardDescription>Fill out the details for your bounty</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-lg font-medium">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="Enter a catchy title for your bounty"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-lg font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="Describe the problem and what you're looking for in a solution"
              rows={5}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="amount" className="text-lg font-medium">Reward Amount ($)</Label>
              <div className="mt-1 relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  placeholder="Enter reward amount"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="deadline" className="text-lg font-medium">Deadline</Label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="tags" className="text-lg font-medium">Tags</Label>
            <div className="mt-1 relative">
              <Tags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="pl-10"
                placeholder="e.g. React, Performance, Security (comma-separated)"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="communicationMethod" className="text-lg font-medium">Communication Method</Label>
            <RadioGroup
              name="communicationMethod"
              value={formData.communicationMethod}
              onValueChange={handleCommunicationMethodChange}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="discord" id="discord" />
                <Label htmlFor="discord">Discord</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">Email</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="communicationValue" className="text-lg font-medium">
              {formData.communicationMethod === 'discord' ? 'Discord Username' : 'Email Address'}
            </Label>
            <Input
              id="communicationValue"
              name="communicationValue"
              value={formData.communicationValue}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder={formData.communicationMethod === 'discord' ? 'Your Discord username' : 'Your email address'}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>Create Bounty</Button>
      </CardFooter>
    </Card>
  )
}
