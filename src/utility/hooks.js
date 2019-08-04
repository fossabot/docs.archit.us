import { useState, useEffect, useMemo } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { globalHistory } from "@reach/router";
import { isDefined } from "./object";
import { splitPath } from "./string";

// Sourced from reach/router/issues/203
// Repository is licensed under MIT
// https://github.com/reach/router/issues/203

export function useLocation() {
  const initialState = {
    location: globalHistory.location,
    navigate: globalHistory.navigate
  };

  const [state, setState] = useState(initialState);
  useEffectOnce(() => {
    const removeListener = globalHistory.listen(params => {
      const { location } = params;
      const newState = Object.assign({}, initialState, { location });
      setState(newState);
    });
    return () => {
      removeListener();
    };
  });

  return state;
}

export function useEffectOnce(effectFunc) {
  useEffect(effectFunc, []);
}

const trimPath = path =>
  "/" +
  path
    .replace(".mdx", "")
    .replace(".md", "")
    .replace("index", "")
    .replace(/\/$/, "");

export function useDocsPages(includeRoot = false) {
  const query = useStaticQuery(graphql`
    query SideNavQuery {
      allFile(
        filter: {
          sourceInstanceName: { eq: "docs" }
          extension: { regex: "/^(?:md)|(?:mdx)$/" }
        }
      ) {
        edges {
          node {
            relativePath
            childMarkdownRemark {
              frontmatter {
                shortTitle
                title
              }
            }
            childMdx {
              frontmatter {
                shortTitle
                title
              }
            }
          }
        }
      }
    }
  `);

  // Transform raw nodes
  return useMemo(() => {
    const mapped = query.allFile.edges.map(({ node }) => {
      const path = trimPath(node.relativePath);
      const { frontmatter } = isDefined(node.childMarkdownRemark)
        ? node.childMarkdownRemark
        : node.childMdx;
      return {
        path,
        title: frontmatter.title,
        shortTitle: frontmatter.shortTitle,
        fragments: splitPath(path)
      };
    });
    return includeRoot ? mapped : mapped.filter(page => page.path !== "/");
  });
}
