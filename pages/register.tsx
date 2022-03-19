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

const Register: NextPage = function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const { register: registerUser } = useContext(AuthContext);

  async function handleSignIn(data: Record<string, any>) {
    try {
      if (data.password !== data["confirm-password"]) {
        alert("Password and confirmation password are not equal");
        return;
      }

      const registerData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await registerUser(registerData);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.match(/400/)) {
          // TODO: Show notification instead of using `alert`
          // 400 = Bad request
          alert("Email already registered");
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
        <title>Register</title>
      </Head>

      <div className={styles.container}>
        <Link href="/" passHref>
          <a className={`${styles.returnButton} neu-button`}>
            <ArrowLeftSvg /> Home
          </a>
        </Link>

        <h1 className={styles.title}>Register</h1>

        <form className={styles.form} onSubmit={handleSubmit(handleSignIn)}>
          <label htmlFor="name" className="sr-only">
            Full name
          </label>
          <input
            className="neu-button-inset"
            {...register("name")}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            required
          />

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
            autoComplete="new-password"
            placeholder="Password"
            required
          />

          <label htmlFor="confirm-password" className="sr-only">
            Confirm your password
          </label>
          <input
            className="neu-button-inset"
            {...register("confirm-password")}
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            required
          />
          <button className={`${styles.submitButton} neu-button`} type="submit">
            Register
          </button>
        </form>

        <Link href="/signin" passHref>
          <a className={styles.link}>Sign in to your account</a>
        </Link>
      </div>
    </>
  );
};

export default Register;
