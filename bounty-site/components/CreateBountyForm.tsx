"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { DollarSign, Calendar, Tags } from "lucide-react"

export default function CreateBountyForm() {
  const router = useRouter()
  const { user } = useUser()
  const createBounty = useMutation(api.bounties.create)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    tags: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be logged in to create a bounty")
      return
    }
    try {
      await createBounty({
        ...formData,
        amount: parseFloat(formData.amount),
        tags: formData.tags.split(',').map(tag => tag.trim()),
        poster: {
          id: user.id,
          name: user.fullName || "",
          avatar: user.imageUrl,
        },
      })
      router.push('/')
    } catch (error) {
      console.error("Failed to create bounty:", error)
      alert("Failed to create bounty")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create a New Bounty</CardTitle>
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
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>Create Bounty</Button>
      </CardFooter>
    </Card>
  )
}