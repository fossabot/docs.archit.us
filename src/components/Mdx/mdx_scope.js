import React from "react";
import Icon from "components/Icon";
import Container from "components/Container";
import Link from "components/Link";
import createHeading from "components/Heading";

const components = {
  Icon,
  Container,
  a: Link,
  h1: createHeading({ component: "h1" }),
  h2: createHeading({ component: "h2" }),
  h3: createHeading({ component: "h3" }),
  h4: createHeading({ component: "h4" }),
  h5: createHeading({ component: "h5" }),
  h6: createHeading({ component: "h6", rightLink: true }),
  table: props => (
    <div className="table-responsive-lg table-outer">
      <table {...props} className="table table-striped" />
    </div>
  )
};

export default components;
