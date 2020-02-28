import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { StoreState, Item } from "../store/Types";

const List = (props: {data: Item[]}): ReactElement => {
  const items = props.data.map((item: Item) => (
    <div className="item" key={item.id} data-item-id={item.id}>{item.label}</div>
  ));

  return (
    <>
      {items}
    </>
  );
};

export default List;