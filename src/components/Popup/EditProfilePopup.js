import { editUser } from "@/utils/api";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const style = {
  borderRadius: 2,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#F2F2F2",
  boxShadow: 24,
  p: 2,
};

export default function EditProfilePopup({ open, handleClose, setUser }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [twitter, setTwitter] = useState("");

  function saveHandler() {
    const payload = {
      user_id: session.user.id,
      firstname: name.split(" ")[0],
      lastname: name.split(" ")[1],
      username: username,
    };

    editUser(session.user.id, payload).then((res) => {
      console.log(res);
      setUser(res);
      handleClose();
    });
  }
  useEffect(() => {
    if (session) {
      setUsername(`${session.user.username}`);
      setName(`${session.user.firstname} ${session.user.lastname}`);
    }
  }, [session, open]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography sx={{ fontWeight: 700 }}>Edit Profile</Typography>
        <TextField
          onChange={(e) => {
            setName(e.target.value);
          }}
          label="Full name"
          value={name}
          sx={{ my: 1 }}
          placeholder="John Doe"
          fullWidth
          size="small"
        />
        <TextField
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          label="Username"
          value={username}
          sx={{ my: 1 }}
          placeholder="john1"
          fullWidth
          size="small"
        />
        <Box
          onClick={saveHandler}
          sx={{
            flex: 1,
            "&:hover": { opacity: 0.7 },
            borderRadius: 2,
            display: "flex",
            backgroundColor: "#151127",
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            mt: 3,
          }}
        >
          <Typography noWrap sx={{ color: "white", fontWeight: 500 }}>
            save
          </Typography>
        </Box>
        {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
      </Box>
    </Modal>
  );
}
