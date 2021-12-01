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
import { StoreState, Item } from "../store/Types";
import ListItem from "./ListItem";

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
    .map((item) => <ListItem key={item.id} item={item} />);

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
