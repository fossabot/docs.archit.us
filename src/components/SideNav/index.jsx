import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { isNil, useLocation, capitalize, useDocsPages } from "utility";
import classNames from "classnames";

import Link from "components/Link";
import Icon from "components/Icon";

import "./style.scss";

function SideNav() {
  const docsPages = useDocsPages();
  const sideNavTree = useMemo(() => {
    // Assemble tree
    const tree = { children: [] };
    docsPages.forEach(page => {
      const { fragments, path, title } = page;
      let subtree = tree;
      for (let i = 0; i < fragments.length; ++i) {
        const index = subtree.children.findIndex(
          node => node.slug === fragments[i]
        );
        if (index !== -1) {
          subtree = subtree.children[index];
        } else {
          const newNode = {
            children: [],
            title: capitalize(fragments[i]),
            slug: fragments[i]
          };
          subtree.children.push(newNode);
          subtree = newNode;
        }
        if (i === fragments.length - 1) {
          subtree.link = path;
          subtree.title = title;
        }
      }
    });

    // Assign nearest linking node going down the tree
    function assignNearestLink(node, currentDepth) {
      // Base case, leaf node
      if (node.children.length === 0) {
        return {
          link: node.link,
          depth: currentDepth
        };
      } else {
        const nearestLinks = [];
        for (let i = 0; i < node.children.length; ++i) {
          nearestLinks.push(
            assignNearestLink(node.children[i], currentDepth + 1)
          );
        }
        const nearestLink = nearestLinks.reduce(
          (current, next) => (current.depth < next.depth ? current : next),
          nearestLinks[0]
        );
        if (isNil(node.link)) {
          node.link = nearestLink.link;
          node.isMasquerade = true;
        }
        return nearestLink;
      }
    }

    assignNearestLink(tree, 0);
    return tree;
  });

  function generateNav(node) {
    return node.children.length > 0 ? (
      <CollapsibleNavLink
        href={node.link}
        label={node.title}
        isMasquerade={node.isMasquerade}
      >
        <ul>{node.children.map(generateNav)}</ul>
      </CollapsibleNavLink>
    ) : (
      <li key={node.slug}>
        <Link
          className="side-nav--link no-children"
          href={node.link}
          children={node.title}
          partiallyActive={false}
        />
      </li>
    );
  }

  return (
    <div className="side-nav">
      <h5>Documentation</h5>
      <ul>{sideNavTree.children.map(generateNav)}</ul>
    </div>
  );
}

export default SideNav;

// ? =================
// ? Helper components
// ? =================

function CollapsibleNavLink({ href, isMasquerade, label, children }) {
  const { location } = useLocation();
  const isPartiallyActive = location.pathname.startsWith(href);
  const [open, setOpen] = useState(isPartiallyActive);
  const onClick = useCallback(() => setOpen(!open), [open]);
  return (
    <li
      key={label}
      className={classNames({
        "partially-active": isPartiallyActive
      })}
    >
      <div className="side-nav--expander-outer">
        <Link
          className={classNames("side-nav--link with-children", {
            "is-masquerade": isMasquerade
          })}
          href={href}
          partiallyActive={false}
        >
          <span>{label}</span>
        </Link>
        <button
          className={classNames("side-nav--expander", { open })}
          onClick={onClick}
        >
          <Icon name="chevron-right" />
        </button>
      </div>
      {open ? children : null}
    </li>
  );
}

CollapsibleNavLink.propTypes = {
  href: PropTypes.string,
  isMasquerade: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};
