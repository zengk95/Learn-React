import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const urlPath = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;
const url = `${urlPath}${DEFAULT_QUERY}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({ result });
    console.log(this.state);
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    console.log(searchTerm);
    this.fetchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedList } });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchTopStories(searchTerm);
  }

  fetchTopStories = (searchTerm) => {
    fetch(`${urlPath}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .then(error => error);
  }

  render() {
    const { searchTerm, result } = this.state;
    console.log(result);
    return (
      <div className="App">
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}>
          <div>
            Search
          </div>
        </Search>
        {
          result ?
            <Table
              result={result}
              onDismiss={this.onDismiss} />
            : null
        }
      </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange} />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

class Table extends Component {
  render() {
    const { result, onDismiss } = this.props;
    console.log(result);
    return (
      <div>
        {result.hits.map(item =>
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <Button
                onClick={() => onDismiss(item.objectID)}>
                Dismiss
            </Button>
            </span>
          </div>
        )}
      </div>
    )
  };
}

class Button extends Component {
  render() {
    const {
      onClick,
      className = '',
      children,
    } = this.props;



    return (
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    );
  }
}




export default App;
