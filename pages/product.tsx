import Head from 'next/head';
import useUser from '@lib/use-user';
import ProductList from '@components/product';
import Layout, { siteTitle } from '@components/layout';

const ProductPage = () => {
  const { user, mutateUser } = useUser();
  return (
  <Layout user={user} mutateUser={mutateUser} activeMenu="product">
    <Head>
      <title>{siteTitle}</title>
    </Head>
    <ProductList role={user?.role} />
  </Layout>
  )
};
export default ProductPage;
