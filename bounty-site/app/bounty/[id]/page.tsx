import BountyDetail from '../../../components/BountyDetail'
import { Id } from "../../../convex/_generated/dataModel"

export default function BountyPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BountyDetail id={params.id as Id<"bounties">} />
    </div>
  )
}

