import React, { ReactElement, useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/Actions';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';

const Form = (props: {onSubmit: () => void}): ReactElement => {
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

    props.onSubmit();

    ipcRenderer.send('close-window');
  }, [value]);

  return (
    <StyledForm onSubmit={onSubmit}>
      <StyledInput autoFocus={true} type="text" onChange={onChange} value={value} />
    </StyledForm>
  )
};

const StyledForm = styled.form`
  display: flex;
  flex: 1 1 auto;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  border: none;
  font-size: 20px;
  padding: 12px 15px;
  background-color: transparent;
  color: #fff;
  border-radius: 3px;
  
  &:active, &:focus {
    background-color: #121212;
    outline: none;
  }
`;

export default Form;