import { withRouter } from 'next/router';

// Components
import Layout from '@/components/Layout/Layout.component';
import DisplayProducts from '@/components/Product/DisplayProducts.component';

import client from '@/utils/apollo/ApolloClient';

import { GET_PRODUCTS_FROM_CATEGORY } from '@/utils/gql/GQL_QUERIES';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

/**
 * Display a single product with dynamic pretty urls
 */
const Category = ({
  categoryName,
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Layout title={`${categoryName ? categoryName : ''}`}>
      {products ? (
        <DisplayProducts products={products} />
      ) : (
        <div className="mt-8 text-2xl text-center">Loading products...</div>
      )}
    </Layout>
  );
};

export default withRouter(Category);

export const getServerSideProps: GetServerSideProps = async ({
  query: { id },
}) => {
  const res = await client.query({
    query: GET_PRODUCTS_FROM_CATEGORY,
    variables: { id },
  });

  return {
    props: {
      categoryName: res.data.productCategory.name,
      products: res.data.productCategory.products.nodes,
    },
  };
};
