import { Fragment } from 'react'

import { ProgressCircular } from '@visa/nova-react'

import styles from '../../styles/shared/LoadingIndicator.module.css'

export default function LoadingIndicator({ loading = true, children = null }) {

  const loader = (
    <div className={styles.overlay}>
      <ProgressCircular indeterminate aria-label="Loading" />
    </div>
  )

  return (
    <Fragment>
      {children}
      {loading && loader}
    </Fragment>
  )
}
