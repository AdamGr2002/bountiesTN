/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useQuery, useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Clock, Tag, User, CheckCircle, XCircle } from "lucide-react"
import { Id } from "../convex/_generated/dataModel"

export default function BountyDetail({ id }: { id: Id<"bounties"> }) {
  const bounty = useQuery(api.bounties.get, { id })
  const solutions = useQuery(api.bounties.getSolutions, { bountyId: id })
  const [solution, setSolution] = useState("")
  const { user } = useUser()
  const submitSolution = useMutation(api.bounties.submitSolution)
  const updateStatus = useMutation(api.bounties.updateStatus)
  const setWinningSolution = useMutation(api.bounties.setWinningSolution)

  if (!bounty) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  const handleSubmitSolution = async () => {
    if (!user) {
      alert("You must be logged in to submit a solution")
      return
    }
    try {
      await submitSolution({
        bountyId: id,
        content: solution,
        submitter: {
          id: user.id,
          name: user.fullName || "",
          avatar: user.imageUrl || ""
        },
      })
      setSolution("")
      alert("Solution submitted successfully")
    } catch (error) {
      console.error("Failed to submit solution:", error)
      alert("Failed to submit solution")
    }
  }

  const handleMarkAsCompleted = async () => {
    try {
      await updateStatus({ id, status: 'closed' })
    } catch (error) {
      console.error("Failed to mark bounty as completed:", error)
      alert("Failed to mark bounty as completed")
    }
  }

  const handleSelectWinner = async (solutionId: Id<"solutions">) => {
    try {
      await setWinningSolution({ bountyId: id, solutionId })
    } catch (error) {
      console.error("Failed to select winning solution:", error)
      alert("Failed to select winning solution")
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-foreground h-32"></div>
        <CardHeader className="-mt-16">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant={bounty.status === 'open' ? 'default' : 'secondary'} className="mb-2">
                {bounty.status}
              </Badge>
              <CardTitle className="text-3xl mb-2">{bounty.title}</CardTitle>
              <CardDescription className="text-lg">{bounty.description}</CardDescription>
            </div>
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={bounty.poster.avatar} alt={bounty.poster.name} />
              <AvatarFallback>{bounty.poster.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-500 h-5 w-5" />
              <span className="font-semibold text-2xl">${bounty.amount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-500 h-5 w-5" />
              <span>Due: {new Date(bounty.deadline).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {bounty.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <User className="text-purple-500 h-5 w-5" />
            <span>Posted by: {bounty.poster.name}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMarkAsCompleted} 
            disabled={bounty.status === 'closed' || user?.id !== bounty.poster.id}
          >
            Mark as Completed
          </Button>
        </CardFooter>
      </Card>

      {bounty.status === 'open' && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe your solution here..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={6}
              className="mb-4"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitSolution} className="w-full">Submit Solution</Button>
          </CardFooter>
        </Card>
      )}

      {solutions && solutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Submitted Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {solutions.map((sol) => (
                <div key={sol._id} className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={sol.submitter.avatar} alt={sol.submitter.name} />
                        <AvatarFallback>{sol.submitter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{sol.submitter.name}</span>
                    </div>
                    {bounty.status === 'open' && user?.id === bounty.poster.id && (
                      <Button onClick={() => handleSelectWinner(sol._id)} size="sm">
                        Select as Winner
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{sol.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {bounty.status === 'closed' && bounty.winningSolution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="text-green-500 h-6 w-6" />
              <span>Winning Solution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{bounty.winningSolution.content}</p>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={bounty.winningSolution.submitter.avatar} alt={bounty.winningSolution.submitter.name} />
                <AvatarFallback>{bounty.winningSolution.submitter.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{bounty.winningSolution.submitter.name}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
