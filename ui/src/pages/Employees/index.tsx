import { useEffect, useState } from 'react'
import { getEmployees } from '../../api/employees'
import type { Employee } from '../../api/types'

function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading employees...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h1>Employees</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.firstName} {emp.lastName}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeesPage
