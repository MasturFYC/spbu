import Head from 'next/head';
import useUser from '@lib/use-user';
import SpbuList from '@components/spbu';
import Layout, { siteTitle } from '@components/layout';

const ProductPage = () => {
  const { user, mutateUser } = useUser();
  return (
  <Layout user={user} mutateUser={mutateUser} activeMenu="spbu">
    <Head>
      <title>{siteTitle}</title>
    </Head>
      <SpbuList role={user?.role} />
  </Layout>
  )
};
export default ProductPage;
