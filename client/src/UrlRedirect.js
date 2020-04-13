import React from 'react';
import config from './config';
import axios from 'axios';
import { Alert, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class UrlRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    };
  }

  clearError = () => {
    this.setState({ error: '' });
  };

  componentDidMount() {
    let shortUrl = this.props.match.params.shortUrl;
    axios
      .get(`${config.API_URI}/${shortUrl}`, { validateStatus: false })
      .then(response => {
        if (response.status !== 200) {
          this.setState({ error: response.data.message });
        } else {
          this.setState({ error: '' });
          window.location.href = response.data.response;
        }
      })
      .catch(error =>
        this.setState({ error: 'Oops. There was a problem redirecting you!' })
      );
  }

  render() {
    return (
      <Container fluid id='errorRedirect' className='text-center'>
        {this.state.error && (
          <Alert variant='danger' onClose={this.clearError} dismissible>
            {this.state.error}
          </Alert>
        )}
      </Container>
    );
  }
}
