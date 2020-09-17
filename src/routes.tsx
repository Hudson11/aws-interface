import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Bucket from './pages/Bucket';
import CreateAccount from './pages/CreateAccount';
import UserHelper from './helpers/UserHelper'

const PrivateRoute = ({ component, isAuthenticated, ...rest }: any) => {
  const routeComponent = (props: any) => (
    isAuthenticated
      ? React.createElement(component, props)
      : <Redirect to={{ pathname: '/' }} />
  );
  return <Route {...rest} render={routeComponent} />;
};

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/home" component={Home} isAuthenticated={UserHelper.isAuthenticated()} />
        <PrivateRoute path="/bucket/:id" component={Bucket} isAuthenticated={UserHelper.isAuthenticated()} />
        <Route path="/createaccount" component={CreateAccount} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes