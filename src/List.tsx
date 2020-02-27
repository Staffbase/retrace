import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreState, Item } from "./store/Types";

const List = (): ReactElement => {
  const data = useSelector((state: StoreState) => state.data);
  const items = Object.values(data).map((item: Item) => (
    <div className="item" key={item.id} data-item-id={item.id}>{item.label}</div>
  ));

  return (
    <>
      {items}
    </>
  );
};

export default List;