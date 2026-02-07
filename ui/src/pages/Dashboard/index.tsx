import { useEffect, useMemo, useState } from 'react'
import type { SelectChangeEvent } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import { getEmployees } from '../../api/employees'
import { getTimeEntries } from '../../api/timeEntries'
import type { Employee, TimeEntry } from '../../api/types'

function getWeekRange(date: Date) {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday start
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { start: monday, end: sunday }
}

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [loading, setLoading] = useState(false)

  const { start, end } = useMemo(() => getWeekRange(new Date()), [])

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => { /* handled silently */ })
  }, [])

  useEffect(() => {
    if (!selectedEmployeeId) {
      setEntries([])
      return
    }
    setLoading(true)
    getTimeEntries({
      employeeId: Number(selectedEmployeeId),
      startDate: formatDate(start),
      endDate: formatDate(end),
    })
      .then((res) => setEntries(res.data))
      .catch(() => { /* handled silently */ })
      .finally(() => setLoading(false))
  }, [selectedEmployeeId, start, end])

  // Build the summary grid
  const projectNames = useMemo(() => {
    const names = new Set<string>()
    entries.forEach((e) => names.add(e.projectName))
    return Array.from(names).sort()
  }, [entries])

  const weekDates = useMemo(() => {
    const dates: string[] = []
    const d = new Date(start)
    for (let i = 0; i < 7; i++) {
      dates.push(formatDate(d))
      d.setDate(d.getDate() + 1)
    }
    return dates
  }, [start])

  // Build grid: date -> project -> hours
  const grid = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    weekDates.forEach((date) => {
      map[date] = {}
    })
    entries.forEach((entry) => {
      if (!map[entry.date]) map[entry.date] = {}
      map[entry.date][entry.projectName] = (map[entry.date][entry.projectName] || 0) + entry.hours
    })
    return map
  }, [entries, weekDates])

  const dailyTotals = useMemo(() => {
    return weekDates.map((date) => {
      return Object.values(grid[date] || {}).reduce((sum, h) => sum + h, 0)
    })
  }, [grid, weekDates])

  const grandTotal = dailyTotals.reduce((sum, h) => sum + h, 0)

  return (
    <div>
      <Typography variant="h1" sx={{ mb: 2 }}>Dashboard</Typography>
      <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Employee</InputLabel>
          <Select
            value={selectedEmployeeId}
            label="Employee"
            onChange={(e: SelectChangeEvent) => setSelectedEmployeeId(e.target.value)}
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
        <Typography variant="body2" color="text.secondary">
          Week of {formatDate(start)} to {formatDate(end)}
        </Typography>
      </Stack>

      {loading && <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>}

      {selectedEmployeeId && !loading && entries.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Day</TableCell>
                {projectNames.map((name) => (
                  <TableCell key={name} sx={{ textAlign: 'center' }}>{name}</TableCell>
                ))}
                <TableCell sx={{ textAlign: 'center' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {weekDates.map((date, i) => (
                <TableRow key={date}>
                  <TableCell>
                    <strong>{DAY_NAMES[i]}</strong>{' '}
                    <Typography variant="caption" color="text.secondary">{date}</Typography>
                  </TableCell>
                  {projectNames.map((name) => (
                    <TableCell key={name} sx={{ textAlign: 'center' }}>
                      {grid[date]?.[name] || '-'}
                    </TableCell>
                  ))}
                  <TableCell sx={{ textAlign: 'center' }}>
                    <strong>{dailyTotals[i] || '-'}</strong>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ '& td': { borderTop: '2px solid #333', bgcolor: '#f0f0f0', color: 'text.primary', fontSize: '0.875rem' } }}>
                <TableCell><strong>Weekly Total</strong></TableCell>
                {projectNames.map((name) => {
                  const total = weekDates.reduce((sum, date) => sum + (grid[date]?.[name] || 0), 0)
                  return <TableCell key={name} sx={{ textAlign: 'center' }}><strong>{total || '-'}</strong></TableCell>
                })}
                <TableCell sx={{ textAlign: 'center' }}><strong>{grandTotal || '-'}</strong></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {selectedEmployeeId && !loading && entries.length === 0 && (
        <Typography>No time entries for this week.</Typography>
      )}
    </div>
  )
}

export default DashboardPage
