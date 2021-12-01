import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Mousetrap from "mousetrap";
import { closeWindow } from "../App";
import { HASHTAG_REGEX, MENTION_REGEX } from "../utils";
import { removeItem, updateItem } from "../store/Actions";
import { Item } from "../store/Types";

const lpad = (n: number): string => {
  return `${n < 10 ? "0" : ""}${n}`;
};

interface Props {
  item: Item;
}

export default function ListItem({ item }: Props) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [label, setLabel] = useState(item.label);
  const created = new Date(item.createdAt);

  useEffect(() => {
    if (mode === "edit") {
      Mousetrap.bindGlobal("esc", () => {
        setMode("view");
        setLabel(item.label);
      });

      return () => Mousetrap.bindGlobal("esc", closeWindow);
    }
  }, [mode]);

  const save = () => {
    dispatch(updateItem({ ...item, label }));
    setMode("view");
  };

  const deleteItem = () => {
    dispatch(removeItem(item));
  };

  return (
    <StyledListItem className="item" key={item.id} data-item-id={item.id}>
      <small>
        {lpad(created.getHours()) + ":" + lpad(created.getMinutes())}
      </small>

      {mode === "view" ? (
        <>
          <label
            dangerouslySetInnerHTML={{
              __html: item.label
                .replace(
                  HASHTAG_REGEX,
                  (str: string) => `<em class="hashtag">${str}</em>`
                )
                .replace(
                  MENTION_REGEX,
                  (str: string) => `<em class="mention">${str}</em>`
                ),
            }}
          />

          <button onClick={() => setMode("edit")}>Edit</button>
          <button onClick={deleteItem}>X</button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus={true}
          />

          <button onClick={save} title="ESC to cancel">
            Save
          </button>
        </>
      )}
    </StyledListItem>
  );
}

const StyledListItem = styled.li`
  padding: 8px 15px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: row;

  & > small {
    color: var(--textDark);
    margin-right: 15px;
    flex: 0 0 auto;
    line-height: 26px;
  }

  & > label {
    flex: 1 1 auto;
    line-height: 26px;
  }

  & > label > em {
    font-style: normal;
  }

  & > label > em.hashtag {
    color: var(--accentBlue);
  }

  & > label > em.mention {
    color: var(--accentRed);
  }

  > button {
    background: none;
    border: none;
    color: var(--accentBlue);
    cursor: pointer;
    font-size: 16px;
    line-height: 26px;
    outline: none;
    padding: 0;
  }

  > button:hover {
    color: var(darken(--accentBlue, 10%));
  }

  > input {
    flex: 1 1 auto;
    background: none;
    border: none;
    color: var(--text);
    font-size: 16px;
    line-height: 26px;
    outline: none;
    padding: 0;
  }

  > input:hover {
    color: var(darken(--text, 10%));
  }
`;
