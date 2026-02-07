import { useState } from 'react'
import TimeEntryForm from '../../components/TimeEntryForm'

function TimeEntriesPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div>
      <h1>Time Entries</h1>
      <TimeEntryForm onSuccess={() => setRefreshKey((k) => k + 1)} />
      <p key={refreshKey}>Time entry list will be implemented in S15.</p>
    </div>
  )
}

export default TimeEntriesPage
