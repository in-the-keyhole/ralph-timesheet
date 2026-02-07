import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import DashboardPage from './pages/Dashboard'
import TimeEntriesPage from './pages/TimeEntries'
import EmployeesPage from './pages/Employees'
import ProjectsPage from './pages/Projects'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/time-entries" element={<TimeEntriesPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
