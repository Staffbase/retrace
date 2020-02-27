import React, { ReactElement, useState, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from './store/Actions';

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
  }, [value]);

  return (
    <form onSubmit={onSubmit}>
      <input type="text" onChange={onChange} value={value} />
    </form>
  )
};

export default Form;