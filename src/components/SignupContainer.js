import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CardMedia,
  CssBaseline,
} from "@mui/material";
import Image from "next/image";
import useWindowDimensions from "../contexts/hooks/useWindowDimensions";
import { signIn } from "next-auth/react";

export default function SignupContainer({
  username,
  setUsername,
  password,
  setPassword,
  error,
  email,
  setEmail,
  name,
  setName,
  handleSignup,
  setNewUser,
  googleHandler,
}) {
  const { width, height } = useWindowDimensions();

  return (
    <Box
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FBF9FB",
      }}
    >
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
        <Typography variant="h1" style={{ color: "black", fontSize: 20, fontWeight: 600 }}>
          lets get started
        </Typography>
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Box style={{ flex: 1 }}>
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  backgroundColor: "rgba(28, 117, 188, 0.09)",
                }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="full name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  backgroundColor: "rgba(28, 117, 188, 0.09)",
                  mt: 2,
                }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  backgroundColor: "rgba(28, 117, 188, 0.09)",
                  mt: 2,
                }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  backgroundColor: "rgba(28, 117, 188, 0.09)",
                  mt: 2,
                }}
              />

              <Typography style={{ color: "red" }}>{error}</Typography>
            </Box>
            <Box
              onClick={handleSignup}
              sx={{
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
              <Typography variant="body1"  noWrap sx={{ color: "white", fontWeight: 500 }}>
                Sign up
              </Typography>
            </Box>
            <Box
              onClick={() => {
                signIn("google");
              }}
              sx={{
                mt: 1,
                flex: 1,
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                backgroundColor: "white",
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                border: 1,
                borderColor: "#DADADA",
              }}
            >
              <img style={{ marginRight: 10 }} src="/google.png" />
              <Typography variant="body1" noWrap sx={{ color: "#00A4FF", fontWeight: 500 }}>
                Continue with Google
              </Typography>
            </Box>
            <Box
              sx={{ fontSize: 13, textAlign: "center", mt: 1, fontWeight: 700 }}
            >
              already have an account?
              <Typography
                onClick={() => {
                  setNewUser(false);
                }}
                display="inline"
                sx={{
                  fontSize: 13,
                  ml: 1,
                  color: "#00A4FF",
                  cursor: "pointer",
                }}
              >
                sign in
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
