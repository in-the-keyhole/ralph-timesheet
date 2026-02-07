export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
}

export interface EmployeeRequest {
  firstName: string
  lastName: string
  email: string
  department: string
}

export interface Project {
  id: number
  name: string
  code: string
  description: string
  active: boolean
}

export interface ProjectRequest {
  name: string
  code: string
  description: string
  active: boolean
}

export interface TimeEntry {
  id: number
  employeeId: number
  employeeName: string
  projectId: number
  projectName: string
  date: string
  hours: number
  description: string
}

export interface TimeEntryRequest {
  employeeId: number
  projectId: number
  date: string
  hours: number
  description: string
}
