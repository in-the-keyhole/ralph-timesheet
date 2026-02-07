import { useCallback, useEffect, useState } from 'react'
import TimeEntryForm from '../../components/TimeEntryForm'
import { getEmployees } from '../../api/employees'
import { getTimeEntries, deleteTimeEntry, updateTimeEntry } from '../../api/timeEntries'
import { getProjects } from '../../api/projects'
import type { Employee, Project, TimeEntry, TimeEntryRequest } from '../../api/types'
import { useToast } from '../../components/Toast'
import './TimeEntries.css'

function TimeEntriesPage() {
  const { showToast } = useToast()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterEmployeeId, setFilterEmployeeId] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<TimeEntryRequest | null>(null)

  const loadEntries = useCallback(() => {
    setLoading(true)
    const filters: Record<string, string | number> = {}
    if (filterEmployeeId) filters.employeeId = Number(filterEmployeeId)
    if (filterStartDate) filters.startDate = filterStartDate
    if (filterEndDate) filters.endDate = filterEndDate

    getTimeEntries(filters as Parameters<typeof getTimeEntries>[0])
      .then((res) => {
        setEntries(res.data)
        setError(null)
      })
      .catch(() => setError('Failed to load time entries'))
      .finally(() => setLoading(false))
  }, [filterEmployeeId, filterStartDate, filterEndDate])

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data)).catch(() => {})
    getProjects().then((res) => setProjects(res.data)).catch(() => {})
  }, [])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  async function handleDelete(id: number) {
    if (!confirm('Delete this time entry?')) return
    try {
      await deleteTimeEntry(id)
      showToast('Time entry deleted')
      loadEntries()
    } catch {
      showToast('Failed to delete time entry', 'error')
    }
  }

  function startEdit(entry: TimeEntry) {
    setEditingId(entry.id)
    setEditData({
      employeeId: entry.employeeId,
      projectId: entry.projectId,
      date: entry.date,
      hours: entry.hours,
      description: entry.description,
    })
  }

  async function saveEdit(id: number) {
    if (!editData) return
    try {
      await updateTimeEntry(id, editData)
      setEditingId(null)
      setEditData(null)
      showToast('Time entry updated')
      loadEntries()
    } catch {
      showToast('Failed to update time entry', 'error')
    }
  }

  return (
    <div>
      <h1>Time Entries</h1>
      <TimeEntryForm onSuccess={loadEntries} />

      <div className="filters">
        <label>
          Employee:
          <select value={filterEmployeeId} onChange={(e) => setFilterEmployeeId(e.target.value)}>
            <option value="">All</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>
        <label>
          From:
          <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
        </label>
        <label>
          To:
          <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
        </label>
      </div>

      {loading && <div className="loading">Loading time entries...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Hours</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                {editingId === entry.id && editData ? (
                  <>
                    <td>
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={editData.employeeId}
                        onChange={(e) => setEditData({ ...editData, employeeId: Number(e.target.value) })}
                      >
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={editData.projectId}
                        onChange={(e) => setEditData({ ...editData, projectId: Number(e.target.value) })}
                      >
                        {projects.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0.25"
                        max="24"
                        step="0.25"
                        value={editData.hours}
                        onChange={(e) => setEditData({ ...editData, hours: Number(e.target.value) })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="primary" onClick={() => saveEdit(entry.id)}>Save</button>{' '}
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{entry.date}</td>
                    <td>{entry.employeeName}</td>
                    <td>{entry.projectName}</td>
                    <td>{entry.hours}</td>
                    <td>{entry.description}</td>
                    <td>
                      <button onClick={() => startEdit(entry)}>Edit</button>{' '}
                      <button className="danger" onClick={() => handleDelete(entry.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TimeEntriesPage
