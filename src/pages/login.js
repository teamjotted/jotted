import React from "react";
import { Box, Typography, CardMedia, CssBaseline } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useWindowDimenstions from "../contexts/hooks/useWindowDimensions";
import Image from "next/image";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import { signOut, signIn, useSession, getSession } from "next-auth/react";

export default function Login({ data }) {
  const { width, height } = useWindowDimenstions();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, seterror] = useState("");
  const [newUser, setNewUser] = useState(false);

  function googleSignIn() {}

  const handleLogin = () => {
    const user = {
      email,
      password,
    };
    console.log(user);
    signIn("credentials", { ...user, redirect: false })
      .then((res) => {
        if (res.ok) {
          console.log(res);
          router.push("/");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSignup = () => {
    const user = {
      name,
      email,
      password,
    };
  };
  function googleHandler() {}
  return (
    <Box
      style={{
        display: "flex",
        // flexDirection: width >= 450 ? "row" : "column",
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <CssBaseline />
      {!newUser ? (
        <LoginContainer
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleLogin={handleLogin}
          setNewUser={setNewUser}
        />
      ) : (
        <SignupContainer
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          name={name}
          setName={setName}
          handleSignup={handleSignup}
          setNewUser={setNewUser}
        />
      )}
      <Box style={{ flex: 1 }}>
        <CardMedia
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            pb: 30,
            px: 5,
            backgroundColor: "#151127",
          }}
          component="box"
          image="/images/backdrops/loginsplash.svg"
        ></CardMedia>
      </Box>
    </Box>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { data: session },
  };
}
