import Rebase from 're-base'
import firebase from '@firebase/app'
import '@firebase/database'

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBBwlG5iBX9RxZ2pJvHOQZZMG98fc_Rog0",
  authDomain: "boite-recettes-fb508.firebaseapp.com",
  databaseURL: "https://boite-recettes-fb508.firebaseio.com",
})

const base = Rebase.createClass(firebaseApp.database())

// This is a named export
export { firebaseApp }

// this is a default export
export default base
