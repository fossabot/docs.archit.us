import React from "react";
import classNames from "classnames";

import Icon from "components/Icon";

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
      <Component {...rest} id={id}>
        {rightLink ? null : link}
        {children}
        {rightLink ? link : null}
      </Component>
    );
  };
}

export default createHeading;
