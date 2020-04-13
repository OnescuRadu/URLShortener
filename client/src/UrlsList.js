import React, { Component } from 'react';
import config from './config';
import axios from 'axios';
import { Row, Col, Container, Table, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
class UrlsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: [],
      sortBy: 'createdAt',
      sort: 'descending',
      limit: 0,
      isLoading: false,
      error: ''
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
      this.fetchUrls();
    });
  }

  fetchUrls = () => {
    axios
      .get(
        `${config.API_URI}/?limit=${this.state.limit}&sortBy=${this.state.sortBy}&sort=${this.state.sort}`
      )
      .then(response => {
        this.setState({
          urls: response.data.urls,
          isLoading: false,
          limit: response.data.urls.length
        });
      })
      .catch(error =>
        this.setState({
          error: 'There was a problem retrieving the data.',
          isLoading: false
        })
      );
  };

  handleInput = (name, event) => {
    this.setState({ [name]: event.target.value }, () => {
      this.fetchUrls();
    });
  };

  render() {
    const loadingIcon = (
      <div className='text-center'>
        <div className='spinner-border' role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
    );

    const dataTable = (
      <Row>
        <Col>
          <Row className='text-center mb-3 mt-3'>
            <Col>
              <label htmlFor='limit'>Number of entries:</label>
              <input
                type='number'
                onChange={this.handleInput.bind(this, 'limit')}
                value={this.state.limit}
                className='form-control'
                name='limit'
              />
            </Col>
            <Col>
              <label htmlFor='sortBy'>Sort by:</label>
              <select
                onChange={this.handleInput.bind(this, 'sortBy')}
                className='form-control'
                name='sortBy'
              >
                <option value='createdAt'>Date created</option>
                <option value='clicked'>Number of clicks</option>
                <option value='shortURL'>Short URL</option>
              </select>
            </Col>
            <Col>
              <label htmlFor='order'>Order:</label>
              <select
                onChange={this.handleInput.bind(this, 'sort')}
                className='form-control'
                name='order'
              >
                <option value='descending'>Descending</option>
                <option value='ascending'>Ascending</option>
              </select>
            </Col>
          </Row>

          <Table striped hover className='text-center' id='urlsTable'>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Full URL</th>
                <th>Number of clicks</th>
                <th>Date created</th>
              </tr>
            </thead>
            <tbody>
              {this.state.urls.map(url => (
                <tr key={url.shortURL}>
                  <td>
                    <a href={`${url.shortURL}`}>{url.shortURL}</a>
                  </td>
                  <td>
                    <a href={`${url.fullURL}`}>{url.fullURL}</a>
                  </td>
                  <td>{url.clicked}</td>
                  <td>{new Date(url.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    );

    return (
      <Container className='min-vh-100'>
        <Row>
          <Col>
            <h1 className='text-center mt-3' ref={this.props.urlsListReference}>
              URLS LIST
            </h1>

            {this.state.error ? (
              <Alert variant='danger'>
                <p className='mb-0 text-center'>{this.state.error}</p>
              </Alert>
            ) : (
              <p className='text-center'>
                Showing {this.state.urls.length} entries.
              </p>
            )}

            <hr />
          </Col>
        </Row>

        {this.state.isLoading ? loadingIcon : dataTable}
      </Container>
    );
  }
}

export default UrlsList;
