import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { isDefined } from "utility";

import Link from "components/Link";

import "./style.scss";

function TableOfContents({ headers }) {
  return (
    <div className="table-of-contents">
      <h2>Table of Contents</h2>
      <nav>
        <ul>
          {isDefined(headers.items) ? <TocItems items={headers.items} /> : null}
        </ul>
      </nav>
    </div>
  );
}

export default TableOfContents;

TableOfContents.propTypes = {
  headers: PropTypes.object
};

// ? =================
// ? Helper components
// ? =================

function TocItems({ items }) {
  return items.map(item => (
    <li key={item.url}>
      <a href={item.url}>{item.title}</a>
      {isDefined(item.items) ? (
        <ul>
          <TocItems items={item.items} />
        </ul>
      ) : null}
    </li>
  ));
  return null;
}

TocItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
};
