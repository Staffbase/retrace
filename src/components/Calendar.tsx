import React, {ReactElement, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {StoreState} from "../store/Types";

export default function Calendar(): ReactElement {
  const filter = useSelector((state: StoreState) => state.filter);

  return (
      <>
        {new Date(filter.from).toDateString()}

      </>
  )
};