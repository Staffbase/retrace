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

import React, { ReactElement, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../store/Types";
import styled from "styled-components";
import { setFilter } from "../store/Actions";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getLastDayOfMonth(month: number): number {
  const date = new Date();
  date.setMonth(month + 1);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return new Date(date.getTime() - 100).getDate();
}

export default function Calendar(): ReactElement {
  const filter = useSelector((state: StoreState) => state.filter);
  const dispatch = useDispatch();
  const now = new Date(filter.from);
  const today = now.getDate();
  const dayOfTheWeek = now.getDay();
  const firstDayOfTheWeek = today - (dayOfTheWeek - 1);

  const lastDayOfPreviousMonth = getLastDayOfMonth(now.getMonth() - 1);
  const lastDayOfNextMonth = getLastDayOfMonth(now.getMonth());

  const onClick = (event: MouseEvent<HTMLDivElement>): void => {
    const selectedFrom: string | null = event.currentTarget.getAttribute(
      "data-from"
    );

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

    if (date > lastDayOfNextMonth) {
      // Overflow to next month
      date = date - lastDayOfNextMonth;
      itemDate.setMonth(itemDate.getMonth() + 1);
    } else if (date < 1) {
      // Overflow to previous month
      date = lastDayOfPreviousMonth + date;
      itemDate.setMonth(itemDate.getMonth() - 1);
    }

    // TODO: Fix overflow into last month

    itemDate.setDate(date);

    return (
      <DayItem
        key={date}
        className={idx === dayOfTheWeek - 1 ? "active" : ""}
        data-from={itemDate.getTime()}
        onClick={onClick}
      >
        <span>
          {date}
          <small>{DAYS[idx]}</small>
        </span>
      </DayItem>
    );
  });

  return <CalendarWrapper>{items}</CalendarWrapper>;
}

const CalendarWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: var(--backgroundLight);
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
    color: var(--textLight);
  }

  & > span > small {
    display: block;
    font-size: 12px;
    margin-top: 3px;
  }

  &.active {
    background-color: var(--backgroundLighter);
  }

  &.active > span {
    color: var(--accentBlue);
  }

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
