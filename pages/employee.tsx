import Head from 'next/head';
import useUser from '@lib/use-user';
import EmployeeList from '@components/employee';
import Layout, { siteTitle } from '@components/layout';

const ProductPage = () => {
  const { user, mutateUser } = useUser();
  return (
  <Layout user={user} mutateUser={mutateUser} activeMenu="employee">
    <Head>
      <title>{siteTitle}</title>
    </Head>
      <EmployeeList role={user?.role} />
  </Layout>
  )
};
export default ProductPage;
