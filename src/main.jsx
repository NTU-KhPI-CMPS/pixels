import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import StoreProvider from './shared/providers/StoreProvider.jsx'

import '@visa/nova-styles/styles.css'
import '@visa/nova-styles/themes/visa-light/index.css'
import './styles/index.css'

const ProjectPage = lazy(() => import('./features/projects/pages/ProjectPage.jsx'))
const SourcesPage = lazy(() => import('./features/projects/pages/SourcesPage.jsx'))
const ResultsPage = lazy(() => import('./features/projects/pages/ResultsPage.jsx'))
const StatisticsPage = lazy(() => import('./features/projects/pages/StatisticsPage.jsx'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'projects',
        element: <ProjectPage />,
      },
      {
        path: 'sources',
        element: <SourcesPage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
    ],
  },
])

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>,
)
