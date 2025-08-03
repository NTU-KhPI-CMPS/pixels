import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Utility } from '@visa/nova-react'

import { selectLoading } from './store/processingSlice.js'

import { Navigation } from './features/common/Navigation.jsx'
import LoadingIndicator from './shared/components/LoadingIndicator.jsx'

export default function App() {

  const isLoading = useSelector(selectLoading)
  const location = useLocation()

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
