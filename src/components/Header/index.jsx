import React from "react";
import PropTypes from "prop-types";

import { Navbar, Container } from "react-bootstrap";
import Link from "components/Link";

import LogoSvg from "assets/logo.svg";
import "./style.scss";

function Header({ sticky, children, leftChildren, ...rest }) {
  return (
    <Navbar
      bg="primary"
      expand="md"
      variant="dark"
      collapseOnSelect
      sticky={sticky ? "top" : null}
      {...rest}
    >
      <Container>
        {leftChildren}
        <Brand />
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link href="https://archit.us/" newTab={false} className="nav-link">
              Main App
            </Link>
          </li>
        </ul>
        <div className="header-children">{children}</div>
      </Container>
    </Navbar>
  );
}

export default Header;

Header.propTypes = {
  leftChildren: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  sticky: PropTypes.bool
};

Header.defaultProps = {
  sticky: true
};

const Brand = props => (
  <Link className="nav-link brand" href="/" {...props}>
    <LogoSvg />
  </Link>
);

Header.Brand = Brand;
