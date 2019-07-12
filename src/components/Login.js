import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Home from './Home'

class Login extends Component {

    state = {
        username: '',
        password: ''
    }

    constructor() {
        super()
        this.username = React.createRef()
        this.password = React.createRef()

        if (this.getToken()) {
            this.getProfile()
        }
        this.logout = this.logout.bind(this)
    }

    login = (event) => {
        event.preventDefault()
        console.log('log in')

        let username = this.username.current.value
        let password = this.password.current.value

        fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ user: {username, password}})
        })
        .then(resp => resp.json())
        .then(json => {
            console.log('login:', json)
            if (json && json.jwt) {
                this.saveToken(json.jwt)
                this.getProfile()
            }
        })
        .then(() => {
            if (this.state.username === '' && this.state.password === '') {
                alert("Please Enter In Data")
            } else {
                return (<Route exact path="/documents" render={routerProps =>
                    <Home {...routerProps} user={this.state} />} />)
            }
        })
    }

    logout() {
        this.clearToken()
        this.setState({username: ''})
    }

    getProfile = () => {
        let token = this.getToken()
        fetch('http://localhost:3000/api/v1/profile', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(resp => resp.json())
        .then(json => {
            console.log('profile:', json)
            this.setState({ user: json.user })
        })
    }

    saveToken(jwt) {
        localStorage.setItem('jwt', jwt)
    }

    clearToken(jwt) {
        localStorage.setItem('jwt', '')
    }

    getToken(jwt) {
        return localStorage.getItem('jwt')
    }

    render() {
        return (
            <div className="page-login">
                <div className="ui centered grid container">
                    <div className="nine wide column">
                        <div className="ui icon warning message">
                            <i className="lock icon"></i>
                                <div className="content">
                                    <div className="header">
                                        Login failed!
                                    </div>
                                <p>You might have misspelled your username or password!</p>
                            </div>
                        </div>
                        <div className="ui fluid card">
                            <div className="content">
                                <form className="ui form" method="POST">
                                    <div className="field">
                                        <label>User</label>
                                        <input type="text" name="user" placeholder="User" ref={this.username}></input>
                                    </div>
                                    <div className="field">
                                        <label>Password</label>
                                        <input type="password" name="pass" placeholder="Password" ref={this.password}></input>
                                    </div>
                                    <button className="ui primary labeled icon button" type="submit" onClick={this.login}>
                                        <i className="unlock alternate icon"></i>
                                        Login
                                    </button>

                                    <button className="ui primary labeled icon button" onClick={this.logout}>
                                        <i className="smile icon"></i>
                                        Logout
                                    </button>
                                </form>
                                <div className="ui error message">
                                    New User?  Sign up
                                    <Home href="/home" render={props =>
                                        <a href="/home" {...props} user={this.state}>
                                            Here!
                                        </a>
                                    }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;