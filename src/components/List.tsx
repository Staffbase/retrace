import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreState, Item } from "../store/Types";
import styled from "styled-components";

const List = (): ReactElement => {
  const data = useSelector(((state: StoreState) => state.data));
  const filter = useSelector(((state: StoreState) => state.filter));

  const items = Object.values(data).filter((item: Item) => {
    return item.createdAt >= filter.from && item.createdAt <= filter.to;
  }).sort((itemA: Item, itemB: Item) => {
    return itemA.createdAt === itemB.createdAt ? 0 : (itemA.createdAt > itemB.createdAt ? 1 : -1);
  }).map((item: Item) => (
    <StyledListItem className="item" key={item.id} data-item-id={item.id}>{item.label}</StyledListItem>
  ));

  return (
    <StyledList>
      {items}
    </StyledList>
  );
};

export default List;

const StyledList = styled.ul`
  background-color: #222;
  display: block;
  margin: 0;
  padding: 0 30px;
  height: 232px;
  overflow: auto;
`;

const StyledListItem = styled.li`
  padding: 8px 15px 8px 0;
  color: #888;
  border-bottom: 1px solid #2a2a2a;
`;