import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { getEmployees } from '../../api/employees'
import { getProjects } from '../../api/projects'
import { createTimeEntry } from '../../api/timeEntries'
import type { Employee, Project, TimeEntryRequest } from '../../api/types'
import { useToast } from '../Toast'

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
    <Paper sx={{ p: 3, maxWidth: 500, mb: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          New Time Entry
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Employee</InputLabel>
          <Select
            value={employeeId}
            label="Employee"
            onChange={(e: SelectChangeEvent) => setEmployeeId(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select employee...</em>
            </MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={projectId}
            label="Project"
            onChange={(e: SelectChangeEvent) => setProjectId(e.target.value)}
            required
          >
            <MenuItem value="">
              <em>Select project...</em>
            </MenuItem>
            {projects.map((proj) => (
              <MenuItem key={proj.id} value={proj.id}>
                {proj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="number"
          label="Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          required
          slotProps={{ htmlInput: { min: 0.25, max: 24, step: 0.25 } }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {Object.keys(errors).length > 0 && (
          <Box sx={{ mb: 2 }}>
            {Object.entries(errors).map(([field, msg]) => (
              <Alert key={field} severity="error" sx={{ mb: 1 }}>
                {msg}
              </Alert>
            ))}
          </Box>
        )}

        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Time Entry'}
        </Button>
      </Box>
    </Paper>
  )
}

export default TimeEntryForm
