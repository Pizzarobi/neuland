import React, { useState } from 'react'
import PropTypes from 'prop-types'

import ListGroup from 'react-bootstrap/ListGroup'

import AppBody from '../components/page/AppBody'
import AppContainer from '../components/page/AppContainer'
import AppNavbar from '../components/page/AppNavbar'
import AppTabbar from '../components/page/AppTabbar'

import styles from '../styles/Imprint.module.css'

export default function Imprint ({ neulandImprint: unsanitizedNeulandImprint }) {
  const [debugUnlockProgress, setDebugUnlockProgress] = useState(0)

  function debugUnlockClicked () {
    if (debugUnlockProgress < 4) {
      setDebugUnlockProgress(debugUnlockProgress + 1)
      return
    }

    if (localStorage.debugUnlocked) {
      localStorage.removeItem('debugUnlocked')
      alert('Debug tools are no longer available!')
    } else {
      localStorage.debugUnlocked = true
      alert('Debug tools are now available!')
    }
    setDebugUnlockProgress(0)
  }

  return (
    <AppContainer>
      <AppNavbar title="Robert flavor" />

      <AppBody>
        <ListGroup>
          <h1 className={styles.imprintTitle}>
            Original von Neuland Ingolstadt.{' '}
            <span onClick={debugUnlockClicked}>:)</span>
          </h1>
          <ListGroup.Item>
            Selfhosted von Robert Kalmar z
            <br/>
            E-Mail:{' '}
            <a href="mailto:kontakt@robert-k.net">
            kontakt@robert-k.net
            </a>
            <br />
            Quellcode auf GitHub:{' '}
            <a href="https://github.com/neuland-ingolstadt/THI-App" target="_blank" rel="noreferrer">
              neuland-ingolstadt/THI-App
            </a>
            <br />
          </ListGroup.Item>
        </ListGroup>
      </AppBody>

      <AppTabbar />
    </AppContainer>
  )
}

Imprint.propTypes = {
  neulandImprint: PropTypes.string
}
