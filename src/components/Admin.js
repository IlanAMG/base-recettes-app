import React, { Component } from 'react'
import AjouterRecette from './AjouterRecette'
import AdminForm from './AdminForm'
import Login from './Login'

import firebase from 'firebase/app'
import 'firebase/auth'
import base, {firebaseApp} from '../base'

export default class Admin extends Component {

    state = {
        uid: null,
        chef: null
    }

    componentDidMount() {
        //faire persister la connexion après le refresh de la page
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.handleAuth({user})
            }
        })
    }

    handleAuth = async authData => {
        //console.log(authData.user.uid) authData que l'ont recoit de .signInWithPop(authProvider)
        const box = await base.fetch(this.props.pseudo, {context: this}) //fetch recupere des données

        if (!box.chef) {
            await base.post(`${this.props.pseudo}/chef`, {
                data: authData.user.uid
            }) // post écrire une donnée
        }

        this.setState({
            uid: authData.user.uid,
            chef: box.chef || authData.user.uid
        })
    }

    authenticate = () => {
        const authProvider = new firebase.auth.FacebookAuthProvider()
        firebaseApp
            .auth()
            .signInWithPopup(authProvider) //on recoit des données par une promesse 
            .then(this.handleAuth) // PUIS on active cette fonction 
    }

    logout = async () => {
        console.log('deco')
        await firebase.auth().signOut()
        this.setState({ uid: null })
    }

    render() {
        const { supprimerRecette, ajouterRecette, recettes, majRecette, chargerExemple} = this.props

        const Logout = <button onClick={this.logout}>Déconnexion</button>
        // Si l'utilisateur n'est pas connecté
        if (!this.state.uid) {
            return <Login authenticate={this.authenticate} />
        }

        if (this.state.uid !== this.state.chef) {
            return (
                <div>
                    <p>Tu n'es pas le chef de cette boîte !</p>
                    {Logout}
                </div>
            )
        }
        return (
            <div className="cards">
                <AjouterRecette ajouterRecette={ajouterRecette}/>
                {
                    Object.keys(recettes)
                        .map(key => <AdminForm 
                                        supprimerRecette={supprimerRecette}
                                        majRecette={majRecette}
                                        recettes={recettes}
                                        key={key}
                                        id={key}
                                        />)
                }
                <footer>
                    {Logout}
                    <button onClick={chargerExemple}>Remplir</button>
                </footer>
            </div> 
        )
    }
}
