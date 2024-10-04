import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async () => {
    return {
      redirect: {
        destination: '/employee',
        permanent: false,
      },
    };
};


export default function Home() {
  return <div>...</div>;
}