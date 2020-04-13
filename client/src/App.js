import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import UrlsList from './UrlsList';
import UrlsForm from './UrlsForm';
import UrlRedirect from './UrlRedirect';

class App extends Component {
  constructor(props) {
    super(props);
    this.urlsListReference = React.createRef();
  }

  render() {
    return (
      <div className='App'>
        <BrowserRouter>
          <Route path='/:shortUrl' component={UrlRedirect} />
          <UrlsForm urlsListReference={this.urlsListReference} />
          <UrlsList urlsListReference={this.urlsListReference} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
