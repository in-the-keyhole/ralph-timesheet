import client from './client'
import type { Project, ProjectRequest } from './types'

export function getProjects(active?: boolean) {
  const params = active !== undefined ? { active } : {}
  return client.get<Project[]>('/projects', { params })
}

export function getProject(id: number) {
  return client.get<Project>(`/projects/${id}`)
}

export function createProject(data: ProjectRequest) {
  return client.post<Project>('/projects', data)
}

export function updateProject(id: number, data: ProjectRequest) {
  return client.put<Project>(`/projects/${id}`, data)
}
