import React, { Component } from 'react';
import axios from 'axios';
import config from './config';
import { Row, Col, Container, Alert, Button } from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

class UrlsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      error: '',
      shortUrl: ''
    };
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitHandler = event => {
    event.preventDefault();
    axios
      .post(`${config.API_URI}/`, this.state)
      .then(response => {
        this.setState({ error: '', shortUrl: response.data.response });
      })
      .catch(error => {
        this.setState({
          error:
            error.response.data.message ||
            'There was a problem shortening your URL. Please try again!'
        });
      });
  };

  handleNewLinkClick = () => {
    this.setState({ shortUrl: '', url: '' });
  };

  scrollToElement = ref => {
    findDOMNode(ref.current).scrollIntoView();
  };

  clearError = () => {
    this.setState({ error: '' });
  };
  render() {
    const { url, error, shortUrl } = this.state;

    const formContainer = (
      <form onSubmit={this.submitHandler} id='urlForm'>
        <input
          type='text'
          name='url'
          autoComplete='off'
          value={url}
          onChange={this.changeHandler}
          id='urlInput'
        />
        <button type='submit' id='emptyButton'>
          <i className='fas fa-cut' id='urlIcon' />
        </button>
      </form>
    );

    const errorContainer = error && (
      <Alert variant='danger' onClose={this.clearError} dismissible>
        <p className='mb-0'>{error}</p>
      </Alert>
    );

    const responseContainer = (
      <div>
        <p>Your URL was successfully created.</p>
        <a href={`${shortUrl}`}>{shortUrl}</a>
        <Button variant='outline-info' onClick={this.handleNewLinkClick}>
          CREATE NEW LINK
        </Button>
      </div>
    );

    return (
      <div className='masthead d-flex text-center'>
        <Container>
          <Row className='h-100'>
            <Col className='d-flex flex-column'>
              <div className='my-auto'>
                <h1>
                  <b>URL SHORTENER</b>
                </h1>
                {errorContainer}
                {shortUrl ? responseContainer : formContainer}
              </div>
              <button
                id='emptyButton'
                onClick={this.scrollToElement.bind(
                  this,
                  this.props.urlsListReference
                )}
                className='mb-3'
              >
                <i className='fas fa-arrow-circle-down fa-2x'></i>
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default UrlsForm;
