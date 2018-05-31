import React from 'react';
import Login from './login';
import renderer from 'react-test-renderer';

test('first test', () => {
  const component = renderer.create(
    <Login />
  );
});