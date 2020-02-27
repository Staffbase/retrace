import React, { ReactElement, useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from './store/Actions';
import styled from 'styled-components';

const ipcRenderer = require('electron').ipcRenderer;

const Form = (): ReactElement => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>('');

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value || '');
  }, [value]);

  const onSubmit = useCallback((event: KeyboardEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value) {
      return;
    }

    dispatch(addItem({ label: value }));
    setValue('');

    ipcRenderer.send('close-window');
  }, [value]);

  return (
    <form onSubmit={onSubmit}>
      <StyledInput type="text" onChange={onChange} value={value} />
    </form>
  )
};

const StyledInput = styled.input`
  display: block;
  width: 100%;
  border: none;
  border-radius: 4px;
  font-size: 20px;
  padding: 12px 15px;
`;

export default Form;