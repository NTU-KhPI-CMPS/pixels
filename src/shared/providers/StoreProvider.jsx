import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import { getPreloadedStore } from '../../store/store.js'

import LoadingIndicator from '../components/LoadingIndicator.jsx'

export default function StoreProvider({ children }) {

  const [store, setStore] = useState()

  useEffect(() => {
    getPreloadedStore().then(setStore)
  }, [])

  if (store) {
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
  } else {
    return (
      <LoadingIndicator />
    )
  }
}
