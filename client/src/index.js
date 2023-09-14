import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { CookiesProvider } from 'react-cookie';

class Index extends React.Component {
  render() {
    return (
      <CookiesProvider>
      <Provider store={store}>
      <App />
      </Provider>
      </CookiesProvider>
    );
  }
}

ReactDOM.render(
  <Index/>,
  document.getElementById('root'),
);
