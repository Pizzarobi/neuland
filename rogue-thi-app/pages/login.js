import React, { useState } from 'react'
import { useRouter } from 'next/router'

import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import AppBody from '../components/page/AppBody'
import AppContainer from '../components/page/AppContainer'
import AppNavbar from '../components/page/AppNavbar'
import { createSession } from '../lib/backend/thi-session-handler'

import styles from '../styles/Login.module.css'

const ORIGINAL_ERROR_WRONG_CREDENTIALS = 'Wrong credentials'
const FRIENDLY_ERROR_WRONG_CREDENTIALS = 'Deine Zugangsdaten sind falsch.'

const IMPRINT_URL = process.env.NEXT_PUBLIC_IMPRINT_URL
const GIT_URL = process.env.NEXT_PUBLIC_GIT_URL

export default function Login () {
  const router = useRouter()
  const { redirect } = router.query

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [saveCredentials, setSaveCredentials] = useState(false)
  const [failure, setFailure] = useState(false)

  async function attemptLogin (e) {
    try {
      e.preventDefault()
      // console.log("attempting login")
      await createSession(username, password, saveCredentials)
      router.replace('/' + (redirect || ''))
    } catch (e) {
      if (e.message.includes(ORIGINAL_ERROR_WRONG_CREDENTIALS)) {
        setFailure(FRIENDLY_ERROR_WRONG_CREDENTIALS)
      } else {
        setFailure('Bei der Verbindung zum Server ist ein Fehler aufgetreten.')
      }
    }
  }

  return (
    <AppContainer>
      <AppNavbar title="freiland" showBack={false} />

      <AppBody>
        <div className={styles.container}>
          <Form className={styles.main} onSubmit={e => attemptLogin(e)} autoComplete="on">
            {failure &&
              <Alert variant="danger">
                {failure}
              </Alert>
            }

            <Form.Group>
              <Form.Label>THI-Benutzername</Form.Label>
              <Form.Control
                type="text"
                autoComplete="username"
                placeholder="abc1234"
                className="form-control"
                value={username}
                isInvalid={!!failure}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                className="form-control"
                value={password}
                isInvalid={!!failure}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                id="stay-logged-in"
                label="Eingeloggt bleiben"
                onChange={e => setSaveCredentials(e.target.checked)}
              />
            </Form.Group>

            <Form.Group>
              <Button type="submit" className={styles.loginButton}>
                Einloggen
              </Button>
            </Form.Group>
          </Form>

          <div className={styles.disclaimer}>
            <h6>Was ist das?</h6>
            <p>
              Das ist eine inoffizielle Alternative zur THI-App, welche eine verbesserte Benutzererfahrung bieten soll. </p>
            <h6>Sind meine Daten sicher?</h6>
            <p>
              <strong>Ja. </strong>
              Deine Daten werden direkt auf deinem Gerät verschlüsselt, in verschlüsselter Form über unseren Proxy an die THI übermittelt
              und erst dort wieder entschlüsselt.
              Nur du und die THI haben Zugriff auf deine Zugangsdaten und deine persönlichen Daten.
            </p>
            <p>
              <a href={`${GIT_URL}/blob/master/docs/data-security-de.md`}>Hier findest du weitere Informationen zur Sicherheit.</a>
            </p>
            <p>
              <a href={GIT_URL} target="_blank" rel="noreferrer">Quellcode auf GitHub</a>
              <> &ndash; </>
              <a href={IMPRINT_URL} target="_blank" rel="noreferrer">Impressum und Datenschutz</a>
            </p>
          </div>
        </div>
      </AppBody>
    </AppContainer>
  )
}
