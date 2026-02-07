import { useEffect, useState } from 'react'
import { getProjects } from '../../api/projects'
import type { Project } from '../../api/types'

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data))
      .catch(() => setError('Failed to load projects'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading projects...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <h1>Projects</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj) => (
            <tr key={proj.id}>
              <td>{proj.name}</td>
              <td>{proj.code}</td>
              <td>{proj.description}</td>
              <td>{proj.active ? 'Active' : 'Inactive'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectsPage
