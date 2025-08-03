import Image from './Image.jsx'
import { Divider } from '@visa/nova-react'

import styles from '../../styles/shared/ImageView.module.css'

export default function ImageView({ imageIdsOrUrls, results = false }) {

  const images = imageIdsOrUrls.flatMap((image, index) => {
    const elements = []

    if (results && index !== 0 && index % 3 === 0) {
      elements.push((
        <Divider key={`${index}-divider`} className={styles.divider} />
      ))
    }

    const alt = results ? `Result Image ${index + 1}` : `Source Image ${index + 1}`
    elements.push((
      <Image
        key={index}
        results={results}
        image={image}
        alt={alt}
      />
    ))

    return elements
  })

  return (
    <div className={styles.gridContainer}>
      {images}
    </div>
  )
}
