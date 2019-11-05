import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from '../src/screen/login/login';
import Home from './screen/home/home';
const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}  forceRefresh={false}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
