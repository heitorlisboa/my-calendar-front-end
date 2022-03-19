import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { parseCookies } from "nookies";
import type { GetServerSideProps, NextPage } from "next";

import styles from "../src/styles/pages/Auth.module.scss";

import ArrowLeftSvg from "../src/svgs/ArrowLeftSvg";
import { AuthContext } from "../src/contexts/AuthContext";
import { decodeAndVerify } from "../src/services/authentication";
import type { SignInData } from "../src/contexts/AuthContext";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { "mycalendar.ruid": refreshToken } = parseCookies(ctx);
  try {
    decodeAndVerify(refreshToken);
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

const Login: NextPage = function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);

  async function handleSignIn(data: Record<string, any>) {
    try {
      await signIn(data as SignInData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.match(/401/)) {
          // TODO: Show notification instead of using `alert`
          // 401 = Unauthorized
          alert("Email or password incorrect");
          return;
        } else if (error.message.match(/Network Error/)) {
          alert("Server unavailable");
          return;
        }
      }

      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>

      <div className={styles.container}>
        <Link href="/" passHref>
          <a className={`${styles.returnButton} neu-button`}>
            <ArrowLeftSvg /> Home
          </a>
        </Link>

        <h1 className={styles.title}>Sign in to your account</h1>

        <form className={styles.form} onSubmit={handleSubmit(handleSignIn)}>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            className="neu-button-inset"
            {...register("email")}
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            required
          />

          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            className="neu-button-inset"
            {...register("password")}
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            required
          />

          <button className={`${styles.submitButton} neu-button`} type="submit">
            Sign in
          </button>
        </form>

        <Link href="/register" passHref>
          <a className={styles.link}>Register an account</a>
        </Link>
      </div>
    </>
  );
};

export default Login;
