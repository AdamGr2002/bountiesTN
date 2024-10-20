/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Clock, Tag, Zap } from "lucide-react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function BountyList() {
  const bounties = useQuery(api.bounties.list);
  const { isSignedIn } = useUser();
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  if (bounties === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Zap className="h-8 w-8 text-primary animate-pulse" />
      </div>
    );
  }

  const filteredBounties = bounties.filter(bounty => {
    if (filter === 'all') return true;
    return bounty.status === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">All Bounties</h2>
        <div className="space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'open' ? 'default' : 'outline'}
            onClick={() => setFilter('open')}
          >
            Open
          </Button>
          <Button
            variant={filter === 'closed' ? 'default' : 'outline'}
            onClick={() => setFilter('closed')}
          >
            Closed
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBounties.map((bounty) => (
          <Card key={bounty._id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl mb-1">{bounty.title}</CardTitle>
                <Badge variant={bounty.status === 'open' ? 'default' : 'secondary'}>
                  {bounty.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{bounty.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center space-x-4 mb-4">
                <DollarSign className="text-green-500 h-5 w-5" />
                <span className="font-semibold text-lg">${bounty.amount}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Clock className="text-blue-500 h-5 w-5" />
                <span className="text-sm text-muted-foreground">Due: {new Date(bounty.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {bounty.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 pt-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bounty.poster.avatar} alt={bounty.poster.name} />
                  <AvatarFallback>{bounty.poster.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{bounty.poster.name}</span>
              </div>
              <Button asChild size="sm">
                <Link href={`/bounty/${bounty._id}`}>
                  {isSignedIn ? "Solve Bounty" : "View Details"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
