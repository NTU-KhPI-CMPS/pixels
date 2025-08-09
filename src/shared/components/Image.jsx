import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '@visa/nova-react'
import { GenericDeleteTiny } from '@visa/nova-icons-react'

import { deleteImage, getImage } from '../utils/indexedDBUtils.js'
import { projectActions } from '../../store/projectSlice.js'

import styles from '../../styles/shared/Image.module.css'

export default function Image({ results, alt, image }) {

  const dispatch = useDispatch()

  const urlRef = useRef(null)
  const imgRef = useRef(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (results) {
      setUrl(image)
      return
    }

    getImage(image)
      .then((image) => {
        if (urlRef.current) {
          URL.revokeObjectURL(urlRef.current)
        }
        urlRef.current = URL.createObjectURL(image.blob)
        setUrl(urlRef.current)
      })

    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
      }
    }
  }, [image, results])

  async function deleteImageClicked() {
    await deleteImage(image)
    dispatch(projectActions.fileDeleted(image))
  }

  function onFullScreen() {
    imgRef.current.requestFullscreen()
  }

  return (
    <div className={styles.container}>
      {!results && (
        <Button title="Delete this image" className={styles.closeButton} onClick={deleteImageClicked}>
          <GenericDeleteTiny />
        </Button>
      )}
      <img
        ref={imgRef}
        className={styles.img}
        src={url}
        alt={alt}
        onClick={onFullScreen}
      />
    </div>
  )
}
