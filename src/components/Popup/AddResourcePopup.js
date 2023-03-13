import { addNodeAttachments, editNodeAttachments } from "@/utils/api";
import { Box, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {toast} from "react-toastify";

export default function AddResourcePopup({
  open,
  handleClose,
  tree,
  attachments,
  node,
  setAttachment,
  selectedResource,
}) {
  const { data: session } = useSession();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function newResourceHandler() {
    console.log(session);
    if (!url) return false;
    const response = await fetch(`/api/preview`, {
      method: "POST",
      body: url,
    });
    const data = await response.json();
    console.log(data);
    const payload = {
      user_id: session.user.id,
      tree_id: tree.id,
      node_id: parseInt(node.id),
      src: url,
      description: data?.description,
      preview_url: data?.image,
      title: data.title ? data.title : "",
      index: attachments.length,
    };
    addNodeAttachments(payload)
      .then((res) => {
        console.log(res.data.resources);
        setAttachment(res.data.resources);
        setUrl("");
        handleClose();
      })
      .catch((e) => {
        console.log(e)
        toast.error(e.response?.data.message);
      });
  }
  function saveResourceHandler() {
    const resource = {
      node_id: node.id,
      src: url,
      preview_url: selectedResource.preview_url,
      description: description,
      title: title,
    };
    editNodeAttachments(selectedResource.id, resource).then((res) => {
      console.log(res.data.resources);
      setAttachment(res.data.resources);
    });
    handleClose();
  }
  useEffect(() => {
    console.log(selectedResource);
    if (selectedResource) {
      setUrl(selectedResource.src);
      setTitle(selectedResource.title);
      setDescription(selectedResource.description);
    } else {
      setUrl("");
      setTitle("");
      setDescription("");
    }
  }, [selectedResource]);

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
            {selectedResource ? "Edit" : "Add"} Resource
          </Typography>
          <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {selectedResource ? (
          <></>
        ) : (
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
                backgroundColor: "#151127",

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
                color: "#151127",
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
        )}
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
        {selectedResource ? (
          <>
            <TextField
              sx={{ my: 1 }}
              placeholder="Add a Title"
              size="small"
              fullWidth
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <TextField
              sx={{ my: 1 }}
              rows={4}
              multiline
              placeholder="Add a description"
              size="small"
              fullWidth
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </>
        ) : (
          <></>
        )}
        {selectedResource ? (
          <Box
            onClick={saveResourceHandler}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 0,
              backgroundColor: "#151127",
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
            <Typography sx={{ fontWeight: 500 }}>Save</Typography>
          </Box>
        ) : (
          <Box
            onClick={newResourceHandler}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 0,
              backgroundColor: "#151127",
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
        )}
      </Box>
    </Modal>
  );
}
