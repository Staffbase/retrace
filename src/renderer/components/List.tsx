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

import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreState, Item } from "../store/Types";
import styled from "styled-components";
import { HASHTAG_REGEX, MENTION_REGEX } from "../utils";

const lpad = (n: number): string => {
  return `${n < 10 ? "0" : ""}${n}`;
};

const List = (): ReactElement => {
  const data = useSelector((state: StoreState) => state.data);
  const filter = useSelector((state: StoreState) => state.filter);

  const items = Object.values(data)
    .filter((item: Item) => {
      return item.createdAt >= filter.from && item.createdAt <= filter.to;
    })
    .sort((itemA: Item, itemB: Item) => {
      return itemA.createdAt === itemB.createdAt
        ? 0
        : itemA.createdAt > itemB.createdAt
        ? -1
        : 1;
    })
    .map((item: Item) => {
      const created = new Date(item.createdAt);

      return (
        <StyledListItem className="item" key={item.id} data-item-id={item.id}>
          <small>
            {lpad(created.getHours()) + ":" + lpad(created.getMinutes())}
          </small>
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
        </StyledListItem>
      );
    });

  return <StyledList>{items}</StyledList>;
};

export default List;

const StyledList = styled.ul`
  background-color: var(--background);
  display: block;
  margin: 0;
  padding: 0;
  height: 232px;
  overflow: auto;
`;

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
`;
