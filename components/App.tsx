import * as React from 'react';
import { BrowserRouter as Router, Link, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';

class AuthExample extends React.Component {
  render() {
    return <Router>
    <div>
      <AuthButton />

      <ul>
        <li>
          <Link to='public'>Public Page</Link>
        </li>
        <li>
          <Link to='protected'>Protected Page</Link>
        </li>
      </ul>
      <Route path='/public' component={Public} />
      <Route path='/login' component={Login} />
      <PrivateRoute path='/protected' component={Protected} />
    </div>
  </Router>;
  }
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(callback) {
    this.isAuthenticated = true;
    callback();
  },
  signout(callback) {
    this.isAuthenticated = false;
    callback();
  }
}


const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

// interface RouterProps extends RouteComponentProps<RouteParams> {}
// interface RouteParams {}
// const MyRouterComponent = withRouter<RouterProps>(
//   class MyComponent extends React.Component<RouteComponentProps<{}>, any> {
//     render() {
//       return <div />;
//     }
//   }
// )

// class MainComponent extends React.Component<any, any> {
//   render() {
//     return <MyRouterComponent />
//   }
// }

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class Public extends React.Component {
  render() {
    return <h3>Public</h3>;
  }
}

class Protected extends React.Component {
  render() {
    return <h3>Protected</h3>;
  }
}

// interface Props extends RouteComponentProps<MatchParams> {}
// interface MatchParams {
//   name: string;
//   topicId: any;
// }

interface LoginProps { location: any; }
class Login extends React.Component<LoginProps> {
  state = {
    redirectToReferrer: false
  };

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={this.login}>Log in</button>
    </div>
  }
}


export default class App extends React.Component {
  render() {
    return <div>
      <h1>Hello world</h1>
      <AuthExample />
    </div>;
  }
}