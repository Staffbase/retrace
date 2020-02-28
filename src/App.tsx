import React, { ReactElement, useCallback, useState, useEffect } from 'react';
import {Provider, useDispatch} from 'react-redux';
import store from './store/Store';
import Form from './components/Form';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import DetailView from "./components/DetailView";

const App = (): ReactElement => {
  const [isCollapsed, setCollapsed] = useState<Boolean>(false);

  useEffect(() => {
    ipcRenderer.send(`window-${isCollapsed ? 'collapse' : 'expand'}`);
  }, [isCollapsed]);

  useEffect(() => {
    ipcRenderer.on('window-collapse', () => {
      setCollapsed(true);
    });

    ipcRenderer.on('window-expand', () => {
      setCollapsed(false);
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <Provider store={store}>
      <HBox>
        <Form onSubmit={setCollapsed.bind(null, true)} />
        <StyledToggleButton onClick={toggleCollapsed} />
      </HBox>

      {!isCollapsed && <DetailView />}
    </Provider>
  );
};

const HBox = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #1a1a1a;
`;

const StyledToggleButton = styled.button`
  flex: 0 0 auto;
  appearance: none;
  background-color: transparent;
  background-image: url("../iconTemplate@2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  color: #ccc;
  font-weight: bold;
  width: 47px;
  border: none;
  outline: none;
`;

export default App;