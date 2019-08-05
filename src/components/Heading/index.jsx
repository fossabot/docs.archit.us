import React from "react";
import classNames from "classnames";

import Icon from "components/Icon";

import "./style.scss";

function createHeading({ component: Component, rightLink = false }) {
  return ({ children, id, ...rest }) => {
    const link = (
      <a
        className={classNames("heading-link", { right: rightLink })}
        href={`#${id}`}
      >
        <Icon name="link" />
      </a>
    );
    return (
      <div className="anchor-wrapper">
        <a className="anchor" name={id}> </a>
        <Component {...rest}>
          {children}
          {link}
        </Component>
      </div>
    );
  };
}

export default createHeading;
