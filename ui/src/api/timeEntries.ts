import client from './client'
import type { TimeEntry, TimeEntryRequest } from './types'

interface TimeEntryFilters {
  employeeId?: number
  projectId?: number
  startDate?: string
  endDate?: string
}

export function getTimeEntries(filters?: TimeEntryFilters) {
  return client.get<TimeEntry[]>('/time-entries', { params: filters })
}

export function getTimeEntry(id: number) {
  return client.get<TimeEntry>(`/time-entries/${id}`)
}

export function createTimeEntry(data: TimeEntryRequest) {
  return client.post<TimeEntry>('/time-entries', data)
}

export function updateTimeEntry(id: number, data: TimeEntryRequest) {
  return client.put<TimeEntry>(`/time-entries/${id}`, data)
}

export function deleteTimeEntry(id: number) {
  return client.delete(`/time-entries/${id}`)
}
