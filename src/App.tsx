import React, { ReactElement, useCallback, useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store/Store';
import List from './List';
import Form from './Form';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

const App = (): ReactElement => {
  const [isCollapsed, setCollapsed] = useState<Boolean>(true);

  useEffect(() => {
    ipcRenderer.send(`window-${isCollapsed ? 'collapse' : 'expand'}`);
  }, [isCollapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <Provider store={store}>
      <HBox>
        <Form onSubmit={setCollapsed.bind(null, true)} />
        <StyledToggleButton onClick={toggleCollapsed}>(i)</StyledToggleButton>
      </HBox>

      {!isCollapsed && <List />}
    </Provider>
  );
};

const HBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledToggleButton = styled.button`
  display: flex;
  flex: 0 0 auto;
`;

export default App;