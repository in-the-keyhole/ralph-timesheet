import { useEffect, useMemo, useState } from 'react'
import { getEmployees } from '../../api/employees'
import { getTimeEntries } from '../../api/timeEntries'
import type { Employee, TimeEntry } from '../../api/types'
import './Dashboard.css'

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
      <h1>Dashboard</h1>
      <div className="dashboard-controls">
        <label>
          Employee:
          <select value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)}>
            <option value="">Select employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </label>
        <span className="week-label">
          Week of {formatDate(start)} to {formatDate(end)}
        </span>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {selectedEmployeeId && !loading && (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Day</th>
              {projectNames.map((name) => (
                <th key={name}>{name}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {weekDates.map((date, i) => (
              <tr key={date}>
                <td><strong>{DAY_NAMES[i]}</strong> <span className="date-label">{date}</span></td>
                {projectNames.map((name) => (
                  <td key={name}>{grid[date]?.[name] || '-'}</td>
                ))}
                <td><strong>{dailyTotals[i] || '-'}</strong></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Weekly Total</strong></td>
              {projectNames.map((name) => {
                const total = weekDates.reduce((sum, date) => sum + (grid[date]?.[name] || 0), 0)
                return <td key={name}><strong>{total || '-'}</strong></td>
              })}
              <td><strong>{grandTotal || '-'}</strong></td>
            </tr>
          </tfoot>
        </table>
      )}

      {selectedEmployeeId && !loading && entries.length === 0 && (
        <p>No time entries for this week.</p>
      )}
    </div>
  )
}

export default DashboardPage
