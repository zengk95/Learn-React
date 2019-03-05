import React, { Component } from 'react';
import './App.css';


const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const urlPath = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}$`;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        }
    }

    setSearchTopStories = (result) => {
        this.setState({ result });
    }

    componentDidMount(){
        const { searchTerm } = this.state;

        fetch(`${urlPath}${searchTerm}`)
        .then(response => response.json())
        .then(result => this.setSearchTopStories(result))
        .catch(error => error);
    }
}