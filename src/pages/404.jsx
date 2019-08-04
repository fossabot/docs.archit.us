import React from "react";

import Layout from "components/Layout";
import SEO from "components/SEO";
import Container from "components/Container";

function NotFoundPage() {
  return (
    <Layout>
      <SEO title="Not Found" />
      <Container className="mt-3">
        <h1>Page Not Found 😕</h1>
      </Container>
    </Layout>
  );
}

export default NotFoundPage;
