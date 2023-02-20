import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Modal,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import cookie from "cookiejs";
// import logo from "../../Assets/main/logo.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import mixpanel from "mixpanel-browser";
import { signIn } from "next-auth/react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function SignInPopup({
  handleCloseLogin,
  setOpenLogin,
  saveTree,
  open,
  handleClose,
  treeDetails,
}) {
  useEffect(() => {}, []);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  function googleHandler() {}
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
          location.reload();

          handleCloseLogin();
        } else {
          toast.error("Please try again");
        }
      })
      .catch((e) => {
        toast.error("Please try again");
        console.log(e);
      });
  };
  return (
    <Modal
      open={open}
      onClose={handleCloseLogin}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          borderRadius: 5,
          boxShadow: 24,
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography
            onClick={handleCloseLogin}
            sx={{ ml: "auto", cursor: "pointer" }}
          >
            Close
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
          Sign in to Continue
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Email"
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
            mt: 3,
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
        <Box sx={{ fontSize: 13, textAlign: "center", my: 2, fontWeight: 700 }}>
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
    </Modal>
  );
}
