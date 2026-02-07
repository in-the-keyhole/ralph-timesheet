import client from './client'
import type { Employee, EmployeeRequest } from './types'

export function getEmployees() {
  return client.get<Employee[]>('/employees')
}

export function getEmployee(id: number) {
  return client.get<Employee>(`/employees/${id}`)
}

export function createEmployee(data: EmployeeRequest) {
  return client.post<Employee>('/employees', data)
}

export function updateEmployee(id: number, data: EmployeeRequest) {
  return client.put<Employee>(`/employees/${id}`, data)
}
