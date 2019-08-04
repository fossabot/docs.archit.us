import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Header from "components/Header";
import Footer from "components/Footer";
import SideNav from "components/SideNav";
import SEO from "components/SEO";
import { Navbar } from "react-bootstrap";

import "scss/main.scss";
import "./style.scss";

function Layout({ title, children, headerProps, footerProps }) {
  // Nav drawer logic
  const [showDrawer, setShowDrawer] = useState(true);
  const expandClick = useCallback(() => setShowDrawer(!showDrawer), [
    showDrawer
  ]);
  const closeDrawer = useCallback(() => setShowDrawer(false));

  return (
    <>
      <SEO title={title} />
      <Header
        {...headerProps}
        leftChildren={
          <Navbar.Toggle
            className="mr-2 mr-sm-3 d-md-none"
            onClick={expandClick}
          />
        }
      />
      <div className={classNames("docs-root", { "show-drawer": showDrawer })}>
        <div className="docs-root--nav">
          <SideNav />
        </div>
        <button className="docs-root--overlay-button" onClick={closeDrawer} />
        <main className="docs-root--main">
          <div children={children} />
          <Footer {...footerProps} />
        </main>
      </div>
    </>
  );
}

export default Layout;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  title: PropTypes.string
};

Layout.defaultProps = {
  headerProps: {},
  footerProps: {}
};
