import React, { useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import { splitPath, useDocsPages, isDefined, capitalize } from "utility";

import Icon from "components/Icon";
import Link from "components/Link";

import "./style.scss";

function Breadcrumb({ location }) {
  const docsPages = useDocsPages(true);
  const fragments = useMemo(() => splitPath(location.pathname), [
    location.pathname
  ]);

  const breadcrumbEntries = useMemo(() => {
    let entries = [];
    let currentPath = "/";
    for (let i = -1; i < fragments.length; ++i) {
      // Build the current path as we iterate
      if (i === 0) currentPath += fragments[0];
      else if (i > 0) currentPath += `/${fragments[i]}`;
      const page = docsPages.find(page => page.path === currentPath);
      if (isDefined(page)) {
        // Don't link the last page
        entries.push({
          href: i === fragments.length - 1 ? undefined : page.path,
          text: isDefined(page.shortTitle) ? page.shortTitle : page.title
        });
      } else {
        if (i === -1) {
          entries.push({ text: "Root" });
        } else {
          entries.push({ text: capitalize(fragments[i]) });
        }
      }
    }
    return entries;
  }, [fragments]);

  const length = breadcrumbEntries.length;
  return (
    <div className="docs-breadcrumb">
      {breadcrumbEntries.map((entry, index) => (
        <Fragment key={`${entry.text}=>${entry.href}`}>
          <BreadcrumbEntry {...entry} />
          {index !== length - 1 ? (
            <Icon className="docs-breadcrumb--icon" name="chevron-right" />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;

Breadcrumb.propTypes = {
  location: PropTypes.object
};

// ? =================
// ? Helper components
// ? =================

function BreadcrumbEntry({ text, href }) {
  return isDefined(href) ? (
    <Link className="docs-breadcrumb--entry" href={href}>
      {text}
    </Link>
  ) : (
    <span className="docs-breadcrumb--entry">{text}</span>
  );
}

BreadcrumbEntry.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string
};
