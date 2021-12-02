import React from "react";
import List from "../components/List";

export default function HistoryView() {
  return (
    <div className="page history">
      <List showAll={true} />
    </div>
  );
}