import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Bucket from './pages/Bucket';
import CreateAccount from './pages/CreateAccount';
import UserHelper from './helpers/UserHelper'
import Rekognition from './pages/Rekognition';

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const routeComponent = (props: any) => (
    UserHelper.isAuthenticated()
      ? <Component {...props} />
      : <Redirect to={{ pathname: '/', state: { from: props.location }} } />
  );
  return <Route {...rest} render={routeComponent} />;
};

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/home" component={Home}/>
        <PrivateRoute path="/bucket/:id" component={Bucket}/>
        <Route path="/createaccount" component={CreateAccount} />
        <Route path="/rekognition" component={Rekognition} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes