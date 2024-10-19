import CreateBountyForm from '../../components/CreateBountyForm'

export default function CreateBountyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Bounty</h1>
      <CreateBountyForm />
    </div>
  )
}