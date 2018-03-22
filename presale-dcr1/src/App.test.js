import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount } from 'enzyme'
import { expect } from 'chai'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
