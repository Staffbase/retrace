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
import styled from "styled-components";
import { format } from "date-fns";
import { StoreState, Item } from "../store/Types";
import ListItem, { StyledListItem } from "./ListItem";

const List = ({ showAll }: { showAll: boolean }): ReactElement => {
  const data = useSelector((state: StoreState) => state.data);
  const filter = useSelector((state: StoreState) => state.filter);

  const bucketsByDay: Record<string, Item[]> = {};

  const items = Object.values(data)
    .filter((item: Item) => {
      if (showAll) {
        return true;
      }

      return item.createdAt >= filter.from && item.createdAt <= filter.to;
    })
    .sort((itemA: Item, itemB: Item) => {
      return itemA.createdAt === itemB.createdAt
        ? 0
        : itemA.createdAt > itemB.createdAt
        ? -1
        : 1;
    })
    .forEach((item: Item) => {
      const created = new Date(item.createdAt);
      const id = format(created, "yyyy-MM-dd");
      bucketsByDay[id] = [...(bucketsByDay[id] || []), item];
    });

  const days = Object.entries(bucketsByDay).map(([id, items]) => {
    const entries = items.map((item: Item) => {
      return <ListItem item={item} key={item.id} />;
    });

    return (
      <div className="day" key={id}>
        {showAll && (
          <StyledListItem className="day-header">
            {format(new Date(id), "PPPP")}
          </StyledListItem>
        )}
        {entries}
      </div>
    );
  });

  return <StyledList>{days}</StyledList>;
};

export default List;

const StyledList = styled.ul`
  background-color: var(--background);
  display: block;
  margin: 0;
  padding: 0;
  height: 232px;
  overflow: auto;

  .page.history & {
    height: auto;
    min-height: 100vh;
  }
`;
