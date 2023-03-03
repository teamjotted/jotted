import React from "react";
import {
  Box,
  Typography,
  CardMedia,
  CssBaseline,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useWindowDimenstions from "../contexts/hooks/useWindowDimensions";
import Image from "next/image";
import LoginContainer from "../components/LoginContainer";
import SignupContainer from "../components/SignupContainer";
import { signOut, signIn, useSession, getSession } from "next-auth/react";
import { createUser, verifyNewUser } from "@/utils/api";
import { toast } from "react-toastify";
import cookie from "cookiejs";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

export default function Login({ data }) {
  const { width, height } = useWindowDimenstions();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [error, seterror] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [verify, setVerify] = useState(false);
  const [otp, setOtp] = useState();

  function googleSignIn() {}

  const handleLogin = () => {
    const user = {
      email,
      password,
    };
    console.log(user);
    signIn("credentials", { ...user, redirect: null })
      .then((res) => {
        if (res?.ok) {
          console.log(res);
          cookie.set("j_ce_u", token);
          router.push("/");
        } else {
          toast.error("Incorrect Credentials, Please Try Again!");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleSignup = () => {
    if ((name, email, password, username)) {
      const user = {
        firstname: name.split(" ")[0],
        lastname: name.split(" ")[1],
        email,
        password,
        username,
      };
      console.log(user);
      createUser(user)
        .then((res) => {
          console.log(res);
          setVerify(true);
        })
        .catch((e) => {
          toast.error("User already exist, please try again!");
          setVerify(false);
        });
    } else {
      toast.error("Looks like your missing something");
    }
  };
  function handleVerify() {
    if (otp && verify) {
      verifyNewUser({ otp, email }).then((res) => {
        console.log(res);
        handleLogin();
      });
    }
  }
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
        <>
          {!verify ? (
            <SignupContainer
              setUsername={setUsername}
              username={username}
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
          ) : (
            <>
              {" "}
              <Box
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#FBF9FB",
                }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: 400,
                    p: 3,
                  }}
                >
                  <Typography variant="h6">
                    Check your email for code.
                  </Typography>
                  <Typography variant="body1" sx={{ color: "grey", my: 1 }}>
                    {email ? email : "no email"}
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter 4 digit code"
                    variant="outlined"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{
                      backgroundColor: "rgba(28, 117, 188, 0.09)",
                    }}
                  />
                  <Box
                    onClick={handleVerify}
                    sx={{
                      width: "100%",
                      mt: 1,
                      flex: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      backgroundColor: "#00A4FF",
                      cursor: "pointer",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "white", fontWeight: 500 }}
                    >
                      Continue
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => {
                      setVerify(false);
                    }}
                    sx={{
                      width: "100%",
                      mt: 1,
                      flex: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      borderColor: "#DADADA",
                      border: 1,
                      cursor: "pointer",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "black", fontWeight: 500 }}
                    >
                      Go Back
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </>
      )}
      {/* {width > 600 && (
        <Box style={{ flex: 1, backgroundColor: "#151127" }}></Box>
      )} */}
    </Box>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });
  console.log(session);

  if (session) {
    setCookie("j_ce_u", session.token, { req, res, maxAge: 60 * 6 * 24 });
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
