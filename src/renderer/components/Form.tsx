/*
Copyright 2020, Staffbase GmbH and contributors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, {
  ReactElement,
  useState,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../store/Actions";
import styled from "styled-components";
import { ipcRenderer } from "electron";
import { flatten } from "../utils";

const Form = (props: { closeAfterSubmit: boolean }): ReactElement => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>("");

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(flatten(event.target.value));
    },
    [value]
  );

  const onSubmit = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!value) {
        return;
      }

      dispatch(addItem({ label: value }));
      setValue("");

      if (props.closeAfterSubmit) {
        ipcRenderer.send("close-window");
      }
    },
    [value, props.closeAfterSubmit]
  );

  return (
    <StyledForm onSubmit={onSubmit}>
      <StyledInput
        autoFocus={true}
        type="text"
        onChange={onChange}
        value={value}
        placeholder={"What's on your mind?"}
        tabIndex={0}
      />
    </StyledForm>
  );
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
  color: var(--textInput);
  border-radius: 3px;

  &:active,
  &:focus {
    background-color: var(--backgroundDarker);
    outline: none;
  }
`;

export default Form;
