import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Modal from "react-responsive-modal";

import * as API from '../../services/API';


class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: true,
            showLoader: false,
            logout: false,
            query: '',
            data: [],
            page: 1,
            showModal: false,
            selectedPlanet: {}
        }
    }

    componentDidMount() {
        let isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            this.setState({ isLoggedIn: true })
        } else {
            this.setState({ isLoggedIn: false })
        }
    }

    search = (page) => {
        let searchValue = this.state.query;
        if (page) {
            searchValue = searchValue + `&page=${page}`
        }
        if (searchValue) {
            API.search(searchValue)
                .then(res => {
                    let data = res.data.results;
                    data = this.state.data.concat(data);
                    this.setState({ data: data, showLoader: true }, () => {
                        if (res.data.count > this.state.data.length) {
                            this.setState({ page: this.state.page + 1 }, () => {
                                this.search(this.state.page)
                            })
                        } else {
                            let filterData = data.sort((a, b) => (b.population - a.population) ? 1 : ((a.population - b.population) ? -1 : 0));
                            this.setState({ data: filterData, showLoader: false });
                        }
                    });
                })
        }
    }

    logout = () => {
        localStorage.removeItem('isLoggedIn');
        this.setState({ logout: true })
    }

    naviateToDetail = (item) => {
        this.setState({ selectedPlanet: item })
        this.onOpenModal();
    }

    onInputChange = (event) => {
        this.setState({ query: event.target.value, data: [], page: 1 }, () => {
            if (this.state.query.length == 0) {
                this.search();
            }
        });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.search();
        }
    }

    onOpenModal = () => {
        this.setState({ showModal: true });
    };

    onCloseModal = () => {
        this.setState({ showModal: false });
    };

    render() {
        const { showLoader, isLoggedIn, data, logout, showModal, selectedPlanet } = this.state;

        if (logout || !isLoggedIn) {
            return <Redirect to="/login" />
        }

        return (
            <div>
                <div className="container">
                    <nav className="navbar navbar-inverse" style={{ margin: `20px auto` }}>
                        <div className="container-fluid">
                            <div className="navbar-header"></div>
                            <ul className="nav navbar-nav">
                                <div>
                                    <input type="text" placeholder="Search Planet...." name="search"
                                        onChange={this.onInputChange}
                                        onKeyPress={this.handleKeyPress}
                                    />
                                    <button type="submit" onClick={() => this.search('')}>&#128269;</button>
                                </div>
                            </ul>
                            <ul className="nav navbar-nav navbar-right">
                                <li><a style={{ color: 'blue', cursor: 'pointer' }} onClick={this.logout}><span className="glyphicon glyphicon-log-in"></span> Logout</a></li>
                            </ul>
                        </div>
                    </nav>
                    {data.length > 0 && <div style={{ margin: 10, fontSize: 18, fontWeight: 500 }}>Sr <span style={{ marginLeft: 20 }}>Name</span><span className="right">Population</span></div>}
                    {data.map((item, index) => {
                        return <div key={item.url} onClick={() => this.naviateToDetail(item)} className="card">
                            <div>{index + 1} : {item.name} <span className="right">{item.population}</span></div>
                        </div>
                    })}
                    {showLoader && <div>Loading more data...</div>}
                    <div className="container">
                        <Modal open={showModal} onClose={this.onCloseModal} style={{ marginTop: 100 }}>
                            <div style={{ width: 400 }}>
                                <h2>Planet Detail:</h2>
                                <div style={style.div}>Name: <span style={style.fontWeight}>{selectedPlanet.name}</span></div>
                                <div style={style.div}>Population: <span style={style.fontWeight}>{selectedPlanet.population}</span></div>
                                <div style={style.div}>Climate: <span style={style.fontWeight}>{selectedPlanet.climate}</span></div>
                                <div style={style.div}>Diameter: <span style={style.fontWeight}>{selectedPlanet.diameter}</span></div>
                                <div style={style.div}>Gravity: <span style={style.fontWeight}>{selectedPlanet.gravity}</span></div>
                                <div style={style.div}>Orbital Period: <span style={style.fontWeight}>{selectedPlanet.orbital_period}</span></div>
                                <div style={style.div}>Rotation Period: <span style={style.fontWeight}>{selectedPlanet.rotation_period}</span></div>
                                <div style={style.div}>Surface Water: <span style={style.fontWeight}>{selectedPlanet.surface_water}</span></div>
                                <div style={style.div}>Terrain: <span style={style.fontWeight}>{selectedPlanet.terrain}</span></div>
                                <div style={style.div}>Url: <span style={style.fontWeight}>{selectedPlanet.url}</span></div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;

const style = {
    back: {
        color: 'blue', cursor: 'pointer', margin: 30, marginLeft: 0
    },

    div: {
        fontWeight: 'bold', padding: `10px 10px 0px 0px`
    },
    fontWeight: {
        fontWeight: 400
    }
}