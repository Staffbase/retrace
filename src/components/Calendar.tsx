import React, {ReactElement, useCallback, MouseEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {StoreState} from "../store/Types";
import styled from "styled-components";
import {setFilter} from "../store/Actions";

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
  const dispatch = useDispatch();
  const now = new Date(filter.from);
  const today = now.getDate();
  const dayOfTheWeek = now.getDay();
  const firstDayOfTheWeek = today - (dayOfTheWeek - 1);

  const nextMonth = new Date(filter.from);
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  nextMonth.setDate(1);
  nextMonth.setHours(0,0,0,0);

  const lastDayOfMonth = new Date(nextMonth.getTime() - 100).getDate();

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    let selectedFrom: string | null = event.currentTarget.getAttribute('data-from');

    if (!selectedFrom) {
      return;
    }

    const selectedDate = parseInt(selectedFrom);

    const newDate = new Date(selectedDate);
    newDate.setHours(23, 59, 59, 99);

    dispatch(setFilter(selectedDate, newDate.getTime()));
  };

  const items = new Array(7).fill(0).map((_, idx: number) => {
    let date = firstDayOfTheWeek + idx;
    const itemDate = new Date(filter.from);

    // Overflow to next month
    if (date > lastDayOfMonth) {
      date = date - lastDayOfMonth;
      itemDate.setMonth(itemDate.getMonth() + 1);
    }

    // TODO: Fix overflow into last month

    itemDate.setDate(date);

    return (
      <DayItem
        key={date}
        className={idx === (dayOfTheWeek - 1) ? 'active' : ''}
        data-from={itemDate.getTime()}
        onClick={onClick}
      >
        <span>
          {date}
          <small>
            {DAYS[idx]}
          </small>
        </span>
      </DayItem>
    );
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
  cursor: pointer;
  
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