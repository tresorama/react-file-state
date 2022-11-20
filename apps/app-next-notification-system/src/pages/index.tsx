import Head from 'next/head';
import Image from 'next/image';
import { Notifications } from '../components/Notifications';

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='max-w-screen-md py-6 px-8'>
        <Notifications />
      </div>
    </>
  );
}
