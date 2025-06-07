"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, Clock, Calendar } from "lucide-react"

interface Bid {
  id: string
  contractorName: string
  contractorRating: number
  amount: number
  timeline: string
  proposal: string
  avatar?: string
  verified: boolean
  submittedAt: string
}

const mockBids: Bid[] = [
  {
    id: "1",
    contractorName: "Sharma Construction",
    contractorRating: 4.8,
    amount: 850000,
    timeline: "4 months",
    proposal:
      "We specialize in residential construction with 15+ years of experience. Our team will ensure quality materials and timely completion.",
    verified: true,
    submittedAt: "2 hours ago",
  },
  {
    id: "2",
    contractorName: "Modern Builders",
    contractorRating: 4.6,
    amount: 920000,
    timeline: "3.5 months",
    proposal:
      "Expert team with modern construction techniques. We provide 3D visualization and regular progress updates.",
    verified: true,
    submittedAt: "5 hours ago",
  },
  {
    id: "3",
    contractorName: "Singh & Sons",
    contractorRating: 4.5,
    amount: 780000,
    timeline: "5 months",
    proposal:
      "Family-run business with focus on quality and customer satisfaction. Competitive pricing with no hidden costs.",
    verified: false,
    submittedAt: "1 day ago",
  },
]

export function ProjectBidding({ projectId }: { projectId: string }) {
  const [showBidForm, setShowBidForm] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const [bidTimeline, setBidTimeline] = useState("")
  const [bidProposal, setBidProposal] = useState("")

  const submitBid = () => {
    // Handle bid submission
    console.log("Submitting bid:", { bidAmount, bidTimeline, bidProposal })
    setShowBidForm(false)
    setBidAmount("")
    setBidTimeline("")
    setBidProposal("")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Project Bids ({mockBids.length})</h3>
        <Button onClick={() => setShowBidForm(!showBidForm)}>{showBidForm ? "Cancel" : "Submit Bid"}</Button>
      </div>

      {showBidForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Bid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bid Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Timeline</label>
                <Input
                  placeholder="e.g., 3 months"
                  value={bidTimeline}
                  onChange={(e) => setBidTimeline(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Proposal</label>
              <Textarea
                placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                rows={4}
                value={bidProposal}
                onChange={(e) => setBidProposal(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitBid} className="flex-1">
                Submit Bid
              </Button>
              <Button variant="outline" onClick={() => setShowBidForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {mockBids.map((bid) => (
          <Card key={bid.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={bid.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{bid.contractorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{bid.contractorName}</h4>
                      {bid.verified && <Badge variant="secondary">Verified</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{bid.contractorRating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">₹{bid.amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {bid.timeline}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{bid.proposal}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Submitted {bid.submittedAt}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button size="sm">Accept Bid</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
