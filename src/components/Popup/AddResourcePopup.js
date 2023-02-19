import { addNodeAttachments, getPreviewUrl } from "@/utils/api";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function AddResourcePopup({
  open,
  handleClose,
  tree,
  attachments,
  node,
  setAttachment,
}) {
  const { data: session } = useSession();
  const [url, setUrl] = useState();

  function newResourceHandler() {
    console.log(session);
    if (!url) return false;
    getPreviewUrl(url).then((res) => {
      console.log(res);
      console.log(tree);
      const payload = {
        user_id: session.user.id,
        tree_id: tree.id,
        node_id: parseInt(node.id),
        src: url,
        description: res.description,
        preview_url: res.image,
        title: res.title ? res.title : "",
        index: attachments.length,
      };
      console.log(payload);
      addNodeAttachments(payload).then((res) => {
        console.log(res.data.resources);
        setAttachment(res.data.resources);
        handleClose();
      });
    });
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "#FBF9FB",
          boxShadow: 24,
          p: 2,
          borderRadius: 3,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontWeight: 600, alignSelf: "center" }}>
            Add Resource
          </Typography>
          <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            mt: 2,
            justifyContent: "center",
          }}
        >
          <Box
            onClick={() => {}}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 0,
              backgroundColor: "#00A4FF",

              justifyContent: "center",
              alignItems: "center",
              width: 100,
              p: 1,
              flex: 1,
              opacity: 0.7,
            }}
          >
            <Typography sx={{ fontWeight: 500, color: "white" }}>
              Paste Url
            </Typography>
          </Box>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mx: 1,
              color: "#7B7B7B",
            }}
          >
            or
          </Typography>
          <Box
            onClick={() => {}}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 0,
              backgroundColor: "white",
              color: "#00A4FF",
              cursor: "pointer",

              justifyContent: "center",
              alignItems: "center",
              width: 100,
              p: 1,
              flex: 1,
              border: 1,
              borderColor: "#DADADA ",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Embed Link</Typography>
          </Box>
        </Box>
        <TextField
          sx={{ my: 1 }}
          placeholder="http://www.example.com"
          size="small"
          fullWidth
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        {/* <TextField
          sx={{ my: 1 }}
          placeholder="Add a Title"
          size="small"
          fullWidth
        />
        <TextField
          sx={{ my: 1 }}
          rows={4}
          multiline
          placeholder="Add a description"
          size="small"
          fullWidth
        /> */}
        <Box
          onClick={newResourceHandler}
          sx={{
            "&:hover": { opacity: 0.7 },
            borderRadius: 2,
            display: "flex",
            boxShadow: 0,
            backgroundColor: "#00A4FF",
            cursor: "pointer",
            mr: 1,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            p: 1,
            flex: 1,
            color: "white",
            ml: "auto",
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>Done</Typography>
        </Box>
      </Box>
    </Modal>
  );
}
