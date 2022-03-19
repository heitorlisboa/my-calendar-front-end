import Head from "next/head";
import { parseCookies } from "nookies";
import type { GetServerSideProps } from "next";

import styles from "../src/styles/pages/Dashboard.module.scss";

import Header from "../src/components/Header";
import { decodeAndVerify } from "../src/services/authentication";
import { useContext } from "react";
import { AuthContext } from "../src/contexts/AuthContext";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "mycalendar.ruid": refreshToken } = parseCookies(ctx);

  try {
    decodeAndVerify(refreshToken);
    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
};

const Dashboard = function DashboardPage() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Header>
        <h1>Dashboard</h1>

        <button
          className={`${styles.signOutButton} neu-button`}
          onClick={signOut}
        >
          Sign out
        </button>
      </Header>
    </>
  );
};

export default Dashboard;
