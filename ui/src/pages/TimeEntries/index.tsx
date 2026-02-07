import { useCallback, useEffect, useState } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import TimeEntryForm from '../../components/TimeEntryForm'
import { getEmployees } from '../../api/employees'
import { getTimeEntries, deleteTimeEntry, updateTimeEntry } from '../../api/timeEntries'
import { getProjects } from '../../api/projects'
import type { Employee, Project, TimeEntry, TimeEntryRequest } from '../../api/types'
import { useToast } from '../../components/Toast'

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
      <Typography variant="h1" sx={{ mb: 2 }}>Time Entries</Typography>
      <TimeEntryForm onSuccess={loadEntries} />

      <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Employee</InputLabel>
          <Select
            value={filterEmployeeId}
            label="Employee"
            onChange={(e: SelectChangeEvent) => setFilterEmployeeId(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          label="From"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 150 }}
        />
        <TextField
          type="date"
          label="To"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 150 }}
        />
      </Stack>

      {loading && <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  {editingId === entry.id && editData ? (
                    <>
                      <TableCell>
                        <TextField
                          type="date"
                          size="small"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={editData.employeeId}
                          onChange={(e) => setEditData({ ...editData, employeeId: Number(e.target.value) })}
                        >
                          {employees.map((emp) => (
                            <MenuItem key={emp.id} value={emp.id}>
                              {emp.firstName} {emp.lastName}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={editData.projectId}
                          onChange={(e) => setEditData({ ...editData, projectId: Number(e.target.value) })}
                        >
                          {projects.map((proj) => (
                            <MenuItem key={proj.id} value={proj.id}>
                              {proj.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={editData.hours}
                          onChange={(e) => setEditData({ ...editData, hours: Number(e.target.value) })}
                          slotProps={{ htmlInput: { min: 0.25, max: 24, step: 0.25 } }}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button variant="contained" size="small" onClick={() => saveEdit(entry.id)}>Save</Button>
                          <Button variant="outlined" size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                        </Stack>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.employeeName}</TableCell>
                      <TableCell>{entry.projectName}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button variant="outlined" size="small" onClick={() => startEdit(entry)}>Edit</Button>
                          <Button variant="contained" color="error" size="small" onClick={() => handleDelete(entry.id)}>Delete</Button>
                        </Stack>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default TimeEntriesPage
