import React, { Component } from 'react';
import { sortBy } from 'lodash';
import './App.css'; 
 
const DEFAULT_QUERY = '';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 20; 
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  URL: list => sortBy(list, 'url').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      page: DEFAULT_PAGE,
      searchKey: '',
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [ ...oldHits, ...hits ];
    this.setState({ results: { ...this.state.results, [searchKey]: { hits: updatedHits, page } }, isLoading: false });
  }

  fetchSearchTopStories(query, page) {
    this.setState({ isLoading: true })
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value, page: 0 });
  }

  onSearchSubmit(event) {
    const { query, page } = this.state;
    this.setState({ searchKey: query });
    if (this.needsToSearchTopStories(query)) {
      this.fetchSearchTopStories(query, page);
    }
    event.preventDefault();
  }

  needsToSearchTopStories(query) {
    return !this.state.results[query];
  }

  onSort(sortKey) {
    const isSortReverse = sortKey === this.state.sortKey ? true : false
    this.setState({ sortKey: sortKey, isSortReverse: isSortReverse });
  }

  componentDidMount() {
    const { query, page } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopStories(query, page);
  }

  render() {
    const { results, query, searchKey, isLoading, sortKey, isSortReverse } = this.state;
    const page = (results && results[searchKey]) ? results[searchKey].page : 0;
    const list = (results && results[searchKey]) ? results[searchKey].hits : [];
    return (
      <div className="page">
        <div className="interactions">
          <Search value={query} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>
            <i className="fa fa-search" aria-hidden="true"></i>
          </Search>
        </div>
        <Table list={list} sortKey={sortKey} onSort={this.onSort} isSortReverse={isSortReverse} />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

const Loading = () => {
  return (
    <div>
      <i className="fa fa-spinner" aria-hidden="true"></i>
    </div>
  );
};

const Search = (props) => {
  const { value, onChange, onSubmit, children } = props;
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} placeholder="Digite um title, author ou Url" />
      <button type="submit" Value="Consultar" >Pesquisar{children}</button>
    </form>
  );
};

const Table = (props) => {
  const { list, sortKey, onSort, isSortReverse } = props;
  const sortedList = SORTS[sortKey](list);
  const reverseSortedList = isSortReverse ? SORTS[sortKey](list).reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: '40%' }}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}>Title</Sort>
        </span>
        <span style={{ width: '45%' }}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}>Author</Sort>
        </span>
        <span style={{ width: '15%' }}>
          <Sort sortKey={'URL'} onSort={onSort} activeSortKey={sortKey}>URL</Sort>
        </span>
      </div>
    { reverseSortedList.map((item) =>
        <div key={item.objectID} className="table-row">
          <span style={{ width: '40%' }}><a href={item.url} className="subject">{item.title}</a></span>
          <span style={{ width: '30%' }}>{item.author}</span>
          <span style={{ width: '15%' }}>{item.url}</span>
        </div>
      ) }
    </div>
  );
};

const Sort = (props) => {
  const { sortKey, onSort, children, activeSortKey } = props;
  const sortClass = ["button-inline"];
  if (sortKey === activeSortKey) {
    sortClass.push("button-active");
  }
  return (
    <Button className={sortClass.join(" ")} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

const Button = (props) => {
  const { onClick, children, className } = props;
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const withLoading = (Component) => ({ isLoading, ...props }) => {
  return (
    isLoading ? <Loading /> : <Component { ...props } />
  );
}

const ButtonWithLoading = withLoading(Button)

export default App;

export {
  Button,
  Search,
  Table,
};
