import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './style.css';
import * as API from '../../services/API';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            isLoggedIn: false,
            isError: false,
            btnDisabled: false
        }
    }

    onInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submit = (e) => {
        e.preventDefault();
        this.setState({ btnDisabled: true, isError: false });
        const { username, password } = this.state;

        API.login(username)
            .then(res => {
                const data = res.data.results[0];
                if (data && data.name === username && data.birth_year === password) {
                    localStorage.setItem('isLoggedIn', true);
                    this.setState({ isLoggedIn: true, btnDisabled: true });
                } else {
                    this.setState({ isError: true, btnDisabled: false });
                }
            }).catch(err => {
                this.setState({ btnDisabled: false })
            });
    }

    render() {
        const { username, password, isLoggedIn, isError, btnDisabled } = this.state;

        if (isLoggedIn) {
            return <Redirect to="/" />
        }

        return (
            <div className="login-form">
                <form onSubmit={this.submit}>
                    <h2 className="text-center">Log in</h2>
                    {isError && <label className="error">Invalid username or password.</label>}
                    <div className="form-group">
                        <input type="text" name="username" value={username} onChange={this.onInputChange} className="form-control" placeholder="Username" required="required" />
                    </div>
                    <div className="form-group">
                        <input type="password" name="password" value={password} onChange={this.onInputChange} className="form-control" placeholder="Password" required="required" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" disabled={btnDisabled}>
                            {btnDisabled ? 'Logging...' : 'Log in'}</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;