import TripCreationWizardAdmin from '@/components/Trips/TripCreationFormAdmin'


function page({searchParams}) {
  const groupId = searchParams?.groupId || null
  return (
    <div>
        <TripCreationWizardAdmin groupId={groupId}/>
    </div>
  )
}

export default page