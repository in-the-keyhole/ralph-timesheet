import { NavLink, Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/time-entries', label: 'Time Entries' },
  { to: '/employees', label: 'Employees' },
  { to: '/projects', label: 'Projects' },
]

function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box
        component="nav"
        sx={{
          width: 220,
          flexShrink: 0,
          bgcolor: 'primary.main',
          color: 'white',
          p: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{ mb: 2, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.2)' }}
        >
          Timesheet
        </Typography>
        <List disablePadding>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.end || undefined}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: 1,
                  '&.active': {
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box component="main" sx={{ flex: 1, p: '1.5rem 2rem', bgcolor: 'background.default' }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
