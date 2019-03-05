import React, { Component } from 'react';
import './App.css';



const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const urlPath = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  setSearchTopStories(result) {

    console.log("SEARCHING");
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits];

    this.setState(
      {
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
      });
  }

  onSearchSubmit = (event) => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm);
    event.preventDefault();
  }

  onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];


    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ results: { ...results, [searchKey]: { hits: updatedHits, page } } });
  }

  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchTopStories(searchTerm);
  }

  fetchTopStories = (searchTerm, page = 0) => {
    fetch(`${urlPath}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .then(error => error);
  }

  render() {
    const { searchTerm, results, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;

    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    console.log(list);
    return (
      <div className="App">

        {
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            <div>
              Search
          </div>
          </Search>
        }
        {
          <Table
            list={list}
            onDismiss={this.onDismiss} />
        }

        <div className="interactions">
          <Button onClick={() => this.fetchTopStories(searchKey, page + 1)}>
            More
          </Button>
        </div>

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
    const { list, onDismiss } = this.props;
    return (
      <div>
        {list.map(item =>
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
