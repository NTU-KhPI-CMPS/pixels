import React, { lazy } from 'react'
import { createRoot } from 'react-dom/client'

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import App from './App.jsx'
import StoreProvider from './shared/providers/StoreProvider.jsx'

import '@visa/nova-styles/styles.css'
import '@visa/nova-styles/themes/visa-light/index.css'
import './styles/index.css'

const ProjectPage = lazy(() => import('./features/projects/pages/ProjectPage.jsx'))
const SourcesPage = lazy(() => import('./features/projects/pages/SourcesPage.jsx'))
const ProcessingPage = lazy(() => import('./features/projects/pages/ProcessingPage'))
const ResultsPage = lazy(() => import('./features/projects/pages/ResultsPage'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ProjectPage />,
      },
      {
        path: 'sources',
        element: <SourcesPage />,
      },
      {
        path: 'processing',
        element: <ProcessingPage />,
      },
      {
        path: 'results',
        element: <ResultsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
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
