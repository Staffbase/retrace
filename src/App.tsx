import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from './store/Store';
import List from './List';
import Form from './Form';

const App = (): ReactElement => {
  return (
    <Provider store={store}>
      <Form />
      <List />
    </Provider>
  );
};

export default App;