import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";

import styles from "../src/styles/pages/Home.module.scss";

import Header from "../src/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>MyCalendar</title>
      </Head>

      <Header>
        <h1>My Calendar</h1>

        <div className={styles.links}>
          <Link href="/register">
            <a className={`${styles.link} neu-button`}>Register</a>
          </Link>
          <Link href="/signin">
            <a className={`${styles.link} neu-button`}>Sign in</a>
          </Link>
        </div>
      </Header>
    </>
  );
};

export default Home;
