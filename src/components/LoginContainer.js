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
export default function LoginContainer({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleLogin,
  setNewUser,
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
        <Typography style={{ color: "black", fontSize: 20, fontWeight: 600 }}>
          sign in to your account
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
                placeholder="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  backgroundColor: "rgba(28, 117, 188, 0.09)",
                }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="Password"
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

              <Box sx={{ display: "flex" }}>
                <Typography
                  sx={{
                    ml: "auto",
                    color: "#00A4FF",
                    fontSize: 12,
                    mt: 1,
                    cursor: "pointer",
                  }}
                >
                  forgot password?
                </Typography>
              </Box>
            </Box>
            <Box
              onClick={handleLogin}
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
              <Typography noWrap sx={{ color: "white", fontWeight: 500 }}>
                sign in
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
              <Typography noWrap sx={{ color: "#00A4FF", fontWeight: 500 }}>
                continue with google
              </Typography>
            </Box>
            <Box
              sx={{ fontSize: 13, textAlign: "center", mt: 1, fontWeight: 700 }}
            >
              Don't have an account?
              <Typography
                onClick={() => {
                  setNewUser(true);
                }}
                display="inline"
                sx={{
                  fontSize: 13,
                  ml: 1,
                  color: "#00A4FF",
                  cursor: "pointer",
                }}
              >
                Sign Up
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
