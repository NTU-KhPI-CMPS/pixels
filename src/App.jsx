import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Utility } from '@visa/nova-react'

import { selectLoading } from './store/processingSlice.js'
import { selectSelectedProject } from './store/projectSlice.js'

import { Navigation } from './shared/components/Navigation.jsx'
import LoadingIndicator from './shared/components/LoadingIndicator.jsx'

export default function App() {

  const isLoading = useSelector(selectLoading)
  const selectedProject = useSelector(selectSelectedProject)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedProject && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [navigate, location, selectedProject])

  const outlet = (
    <Suspense key={location.key} fallback={<LoadingIndicator />}>
      <Outlet />
    </Suspense>
  )

  return (
    <LoadingIndicator loading={isLoading}>
      <Navigation />
      <Utility vMargin={20} id="content">
        {outlet}
      </Utility>
    </LoadingIndicator>
  )
}
