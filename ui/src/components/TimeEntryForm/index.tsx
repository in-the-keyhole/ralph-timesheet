import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { getEmployees } from '../../api/employees'
import { getProjects } from '../../api/projects'
import { createTimeEntry } from '../../api/timeEntries'
import type { Employee, Project, TimeEntryRequest } from '../../api/types'
import { useToast } from '../Toast'
import './TimeEntryForm.css'

interface TimeEntryFormProps {
  onSuccess?: () => void
}

function TimeEntryForm({ onSuccess }: TimeEntryFormProps) {
  const { showToast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const [employeeId, setEmployeeId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    getEmployees().then((res) => setEmployees(res.data)).catch(() => {})
    getProjects(true).then((res) => setProjects(res.data)).catch(() => {})
  }, [])

  function clearForm() {
    setEmployeeId('')
    setProjectId('')
    setDate('')
    setHours('')
    setDescription('')
    setErrors({})
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)

    const data: TimeEntryRequest = {
      employeeId: Number(employeeId),
      projectId: Number(projectId),
      date,
      hours: Number(hours),
      description,
    }

    try {
      await createTimeEntry(data)
      clearForm()
      showToast('Time entry created successfully')
      onSuccess?.()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response: { data: Record<string, string> } }).response
        if (response?.data) {
          setErrors(response.data)
        }
      } else {
        setErrors({ error: 'Failed to create time entry' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="time-entry-form" onSubmit={handleSubmit}>
      <h2>New Time Entry</h2>

      <div className="form-group">
        <label htmlFor="employeeId">Employee</label>
        <select
          id="employeeId"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
        >
          <option value="">Select employee...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="projectId">Project</label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          required
        >
          <option value="">Select project...</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="hours">Hours</label>
        <input
          id="hours"
          type="number"
          min="0.25"
          max="24"
          step="0.25"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="form-errors">
          {Object.entries(errors).map(([field, msg]) => (
            <p key={field} className="error">{msg}</p>
          ))}
        </div>
      )}

      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Time Entry'}
      </button>
    </form>
  )
}

export default TimeEntryForm
