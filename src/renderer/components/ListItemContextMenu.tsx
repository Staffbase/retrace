import React from "react";
import Tippy from "@tippyjs/react";
import styled from "styled-components";
import "tippy.js/dist/svg-arrow.css";

interface Props {
  onClick: (action: "edit" | "delete") => void;
}

export default function ListItemContextMenu(props: Props) {
  const edit = () => {
    props.onClick("edit");
  };

  const remove = () => {
    props.onClick("delete");
  };

  return (
    <Tippy
      trigger="click"
      placement="bottom"
      content={
        <StyledMenu>
          <button onClick={edit}>Edit</button>
          <button onClick={remove}>Remove</button>
        </StyledMenu>
      }
    >
      <StyledActionButton>⋮</StyledActionButton>
    </Tippy>
  );
}

const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundLighter);
  border: 1px solid var(--backgroundLight);
  border-radius: 5px;
  padding: 3px;
  pointer-events: all;

  > button {
    background-color: transparent;
    border: none;
    color: var(--text);
    cursor: pointer;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: 5px;
    text-align: left;

    &:hover {
      background-color: var(--backgroundLight);
    }

    &:not(:last-child) {
      margin-bottom: 3px;
    }
  }
`;

const StyledActionButton = styled.button`
  padding: 0 6px;
`;
