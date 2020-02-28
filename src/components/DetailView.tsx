import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Item, StoreState} from "../store/Types";
import List from "./List";
import Calendar from "./Calendar";

export default function DetailView(): ReactElement {
  const {data, filter} = useSelector((state: StoreState) => state);

  const renderData = Object.values(data).filter((item: Item) => {
    return item.createdAt >= filter.from && item.createdAt <= filter.to;
  }).sort((itemA: Item, itemB: Item) => {
    return itemA.createdAt === itemB.createdAt ? 0 : (itemA.createdAt > itemB.createdAt ? 1 : -1);
  });

  return (
    <>
      <Calendar/>
      <List data={renderData} />
    </>
  )
};