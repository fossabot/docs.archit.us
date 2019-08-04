const path = require("path");
const linkSchema = require("./src/components/Link/schema");
const DocsPageTemplate = path.resolve("./src/templates/Docs/index.jsx");

// Whether or not to print verbose debug messages to stdout
const verbose = true;
const ifVerbose = func => (verbose ? func() : void 0);
const debug = (reporter, text, mode = "info") =>
  ifVerbose(() =>
    ({
      info: content => reporter.info(content),
      success: content => reporter.success(content)
    }[mode](text))
  );

const isDefined = obj => !(obj == null);

// Define custom graphql schema to enforce rigid type structures
exports.sourceNodes = ({ actions, reporter }) => {
  activity = reporter.activityTimer("implementing custom graphql schema");
  activity.start();

  const { createTypes } = actions;
  const typeDefs = `
    type Frontmatter {
      links: [Link]
      title: String
      shortTitle: String
      noTOC: Boolean
      noBreadcrumb: Boolean
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      html: String
    }
    type Mdx implements Node {
      frontmatter: Frontmatter
    }
    type File implements Node {
      childMarkdownRemark: MarkdownRemark
      childMdx: Mdx
    }
  `;
  createTypes(linkSchema);
  createTypes(typeDefs);

  activity.end();
};

// Dynamically create documentation pages
exports.createPages = ({ graphql, actions, reporter }) => {
  let activity = reporter.activityTimer(`loading docs pages via graphql`);
  activity.start();

  const { createPage } = actions;
  return graphql(
    `
      query loadPagesQuery($limit: Int!) {
        allFile(
          limit: $limit
          filter: {
            sourceInstanceName: { eq: "docs" }
            extension: { regex: "/^(?:md)|(?:mdx)$/" }
          }
        ) {
          edges {
            node {
              relativePath
              childMarkdownRemark {
                id
              }
              childMdx {
                id
              }
            }
          }
        }
      }
    `,
    { limit: 1000 }
  ).then(result => {
    if (result.errors) {
      activity.end();
      throw result.errors;
    }

    activity.end();
    activity = reporter.activityTimer(`dynamically generating docs pages`);
    activity.start();

    // Flatmap function that tags whether a node is md or mdx while validating
    // that it has content at all
    const tagOrCull = ({ childMarkdownRemark: md, childMdx: mdx, ...rest }) => {
      const isMd = isDefined(md);
      const isMdx = isDefined(mdx);
      if (isMd || isMdx) return { ...rest, isMdx, id: isMdx ? mdx.id : md.id };
      else {
        // Log error and cull by returning empty array
        reporter.error(`node ${rest.name} has no valid md or mdx content`);
        return [];
      }
    };
    // Trims a path to be the proper local path
    const trimPath = path =>
      path
        .replace(".mdx", "")
        .replace(".md", "")
        .replace("index", "")
        .replace(/\/$/, "");

    // Create docs pages from both md and mdx
    result.data.allFile.edges
      .flatMap(({ node }) => tagOrCull(node))
      .forEach(({ id, relativePath, isMdx }) => {
        // Create final URL as trimmed filepath
        const trimmedPath = trimPath(relativePath);
        createPage({
          path: `/${trimmedPath}`,
          component: DocsPageTemplate,
          context: { id, isMdx }
        });
        // Log debug message
        debug(reporter, `docs page @ '/${trimmedPath}' => ${id}`);
      });

    activity.end();
  });
};

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    // Allow relative imports like "import Foo from 'components/Foo'"
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".jsx", ".json", ".mdx"]
    }
  });
};
