import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            An unexpected error occurred. Please try refreshing the page.
          </Typography>
          <Box
            component="pre"
            sx={{ color: 'error.main', fontSize: '0.85rem', mb: 2 }}
          >
            {this.state.error?.message}
          </Box>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </Button>
        </Container>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
