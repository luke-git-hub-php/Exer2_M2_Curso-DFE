import React from 'react';
import ReactDOM from 'react-dom';
import rendered from 'react-test-renderer';
import { Search, Button, Table } from './App';
  
describe('Search', () => {
 
  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Search>Search</Search>, div);
  });

  test('snapshots', () => {
    const component = rendered.create(
      <Search>Search</Search>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Button', () => {

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>More</Button>, div);
  });

  test('snapshots', () => {
    const component = rendered.create(
      <Button>More</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Table', () => {

  const props = {
    list: [
      { title: '1', author: '1', url: 1},
      { title: '2', author: '2', url: 1},
    ],
  };

  it('renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Table {...props} />, div);
  });

  test('snapshots', () => {
    const component = rendered.create(
      <Table {...props} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
