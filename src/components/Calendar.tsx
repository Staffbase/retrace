import React, {ReactElement, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {StoreState} from "../store/Types";
import styled from "styled-components";

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

export default function Calendar(): ReactElement {
  const filter = useSelector((state: StoreState) => state.filter);
  const today = new Date(filter.from).getDate();
  const dayOfTheWeek = new Date(filter.from).getDay();
  const firstDayOfTheWeek = today - (dayOfTheWeek - 1);

  const items = new Array(7).fill(0).map((_, idx: number) => {
    const date = firstDayOfTheWeek + idx;
    return <DayItem key={date} className={idx === (dayOfTheWeek - 1) ? 'active' : ''}>
      <span>
        {date}
        <small>
          {DAYS[idx]}
        </small>
      </span>
    </DayItem>;
  });

  return (
    <CalendarWrapper>
      {items}
    </CalendarWrapper>
  )
};

const CalendarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: #333;
`;

const DayItem = styled.div`
  flex: 1 0 calc(100% / 7);
  position: relative;
  
  & > span {
   display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    font-size: 25px;
    color: #ddd;
  }
  
  & > span > small {
    display: block;
    font-size: 12px;
    margin-top: 3px;
  }
  
  &.active {
    background-color: #444;
  }
  
  &.active > span {
    color: #00a4fd;
  }
  
  &:after{
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;