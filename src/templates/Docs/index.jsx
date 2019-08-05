import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { graphql } from "gatsby";
import { isDefined } from "utility";

import Breadcrumb from "components/Breadcrumb";
import Layout from "components/Layout";
import Mdx from "components/Mdx";
import TableOfContents from "components/TableOfContents";

import "./style.scss";

export const pageQuery = graphql`
  fragment PageData on Frontmatter {
    title
    shortTitle
    noTOC
    noBreadcrumb
  }
  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        ...PageData
      }
      body
      tableOfContents(maxDepth: 4)
    }
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        ...PageData
      }
      html
      tableOfContents(maxDepth: 4)
    }
  }
`;

function DocsPageTemplate({ data, pageContext, location }) {
  const { isMdx } = pageContext;
  const root = isMdx ? data.mdx : data.markdownRemark;
  const { title, shortTitle, noTOC, noBreadcrumb } = root.frontmatter;
  const content = isMdx ? root.body : root.html;
  const tableOfContents = root.tableOfContents;
  const docContent = isMdx ? (
    <Mdx content={content} />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
  const toc = !noTOC ? <TableOfContents headers={tableOfContents} /> : null;

  return (
    <Layout title={isDefined(shortTitle) ? shortTitle : title}>
      <article className="container docs-root--content">
        {!noBreadcrumb ? <Breadcrumb location={location} /> : null}
        <h1>{title}</h1>
        <div
          className={classNames("docs-content--wrapper", {
            "with-toc": !noTOC
          })}
        >
          <div className="docs-content">{docContent}</div>
          <div>{toc}</div>
        </div>
      </article>
    </Layout>
  );
}

export default DocsPageTemplate;

DocsPageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.shape({ isMdx: PropTypes.boolean }).isRequired,
  location: PropTypes.object.isRequired
};
