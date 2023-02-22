import { openDB } from 'idb'

const STORE_NAME = 'credentials'

function objectToArrayBuffer (obj) {
  return new TextEncoder().encode(JSON.stringify(obj))
}

function arrayBufferToObject (buf) {
  return JSON.parse(new TextDecoder().decode(buf))
}

/**
 * Stores credentials in IndexedDB, encrypted with a non-extractable key.
 * This does not prevent a bad actor from stealing credentials from a device
 * that he has access to, but at least the credentials are not stored in plain
 * text in localStorage.
 *
 * In the future (when Safari supports PasswordCredential), this should be
 * replaced with the Credential Management API.
 */
export default class CredentialStorage {
  constructor (name) {
    this.name = name

    if (typeof window === 'undefined') {
      throw new Error('Browser is required')
    }
    if (typeof window.indexedDB === 'undefined') {
      throw new Error('Browser does not support IndexedDB')
    }
    if (typeof window.crypto === 'undefined') {
      throw new Error('Browser does not support SubtleCrypto')
    }
  }

  async _openDatabase () {
    return await openDB(this.name, 1, {
      upgrade (db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    })
  }

  async write (id, data) {
    // console.log("write", id, data)

    // 1. Generate a key
    // console.log('Generate key')
    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-CBC',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    )
    // 2. Generate an initialization vector
    // console.log("Generate iv")
    const iv = crypto.getRandomValues(new Uint8Array(16))
    // 3. Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv
      },
      key,
      objectToArrayBuffer(data)
    )
    // 4. Write the encrypted data to the database
    // console.log("Write to db")
    const db = await this._openDatabase()
    try {
      // console.log('Try storing id')
      await db.put(STORE_NAME, { id, key, iv, encrypted })
    } finally {
      db.close()
      // console.log('Closed db')
    }
  }

  async read (id) {
    const db = await this._openDatabase()
    try {
      const { key, iv, encrypted } = await db.get(STORE_NAME, id) || {}

      if (!key) {
        return
      }

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-CBC',
          iv
        },
        key,
        encrypted
      )

      return arrayBufferToObject(decrypted)
    } finally {
      db.close()
    }
  }

  async delete (id) {
    const db = await this._openDatabase()
    try {
      await db.delete(STORE_NAME, id)
    } finally {
      db.close()
    }
  }
}
