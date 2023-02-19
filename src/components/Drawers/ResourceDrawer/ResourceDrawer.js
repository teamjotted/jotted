import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Backdrop,
  Drawer,
  Tooltip,
  Button,
  IconButton,
  Modal,
} from "@mui/material";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import mixpanel from "mixpanel-browser";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import IFrameComponent from "./IFrameComponent";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

export default function ResourceDrawer({
  likeHandler,
  dislikeHandler,
  frameRefresh,
  setFrameRefresh,
  setFrame,
  frame,
  nextHandler,
  openUrl,
  setOpenUrl,
  resource,
  prevHandler,
  treeAdmin,
}) {
  const { height, width } = useWindowDimensions();
  const [readMore, setReadMore] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    setError(false);
    // setError(!error);
  }, [frame]);

  // console.log(error);
  return (
    <>
      <Drawer
        elevation={10}
        ModalProps={{}}
        anchor={"bottom"}
        open={openUrl}
        variant={openUrl ? "permanent" : "temporary"}
        onClose={() => {
          setOpenUrl(false);
        }}
        sx={{
          ".MuiDrawer-paperAnchorBottom": {
            boxShadow: 10,
            backgroundColor: "white",
            borderTopLeftRadius: width >= 450 ? 10 : 0,
            borderTopRightRadius: width >= 450 ? 10 : 0,
            height: width >= 450 ? height - 75 : height - 50,
            mx: width >= 450 ? 2 : 0,
            overflowY: width >= 450 ? "auto" : "auto",
            overflowX: "hidden",
            maxWidth: width >= 450 ? width - 500 : width,
            ml: "auto",
            p: 1,
            "&::-webkit-scrollbar": {
              width: "0.2em",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: 3,
              opacity: 0.4,
            },
          },
        }}
      >
        <Box sx={{}}>
          <Box
            onClick={() => {
              setFrame(null);
              setOpenUrl(false);
            }}
            sx={{
              zIndex: 100,
              position: "absolute",
              // opacity: 0.3,
              // "&:hover": { opacity: 1 },
              display: "flex",
              m: 1,
              cursor: "pointer",
            }}
          >
            <IconButton sx={{ backgroundColor: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <motion.div
            animate={{ y: -5 }}
            transition={{ type: "spring" }}
            initial={{ y: 30 }}
          >
            <Box>
              <>
                {frameRefresh ? (
                  <Box sx={{ mt: 0.8 }}>
                    <IFrameComponent frame={frame} resource={resource} />
                  </Box>
                ) : (
                  <></>
                )}
                <Box sx={{ display: "flex", p: 2 }}>
                  <Box
                    onClick={() => {
                      // const iframe = document.getElementById('reciever');
                      // console.log(document.getElementById("reciever").onload());
                    }}
                    // onClick={() => {
                    // 	prevHandler();
                    // }}
                    sx={{
                      flex: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      borderColor: "#00A4FF",
                      cursor: "pointer",
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      p: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        color: "#1D1D1D",
                        fontSize: 12,
                      }}
                    >
                      Back
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => {
                      nextHandler();
                    }}
                    sx={{
                      flex: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "#00A4FF",
                      cursor: "pointer",
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      sx={{ color: "white", fontWeight: 600, fontSize: 12 }}
                    >
                      Next
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    backgroundColor: "#F2F1F6",
                    m: 2,
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                      {resource?.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: readMore ? "" : 2,
                      }}
                    >
                      {resource?.description}{" "}
                    </Typography>
                    {resource?.description.length >= 20 ? (
                      <Typography
                        onClick={() => {
                          setReadMore(!readMore);
                        }}
                        display="inline"
                        sx={{
                          color: "#00A4FF",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {readMore ? "Read Less" : "Read More"}
                      </Typography>
                    ) : (
                      <></>
                    )}
                  </Box>

                  <Box sx={{ p: 1, ml: "auto" }}>
                    <Box
                      onClick={() => {
                        window.open(resource.src);
                      }}
                      sx={{
                        "&:hover": { opacity: 0.7 },
                        display: "flex",
                        cursor: "pointer",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 1,
                      }}
                    >
                      <Tooltip title="Go to Link">
                        <InsertLinkIcon sx={{ "&:hover": { opacity: 0.1 } }} />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  boxShadow: 3,
                  borderRadius: 10,
                  width: 100,
                  justifyContent: "center",
                  px: 8,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: 1,
                    borderColor: "#DADADA",
                    cursor: "pointer",
                    px: 2,
                    "&:hover": {
                      color: "green",
                    },
                  }}
                >
                  <ThumbUpIcon
                    onClick={() => {
                      likeHandler(resource);
                    }}
                    sx={{
                      mr: 1,

                      fontSize: 15,
                    }}
                  />
                  <Typography sx={{ fontSize: 12 }}>
                    {resource?.likes}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    cursor: "pointer",
                    "&:hover": {
                      color: "red",
                    },
                  }}
                >
                  <ThumbDownIcon
                    onClick={() => {
                      dislikeHandler(resource);
                    }}
                    sx={{
                      fontSize: 15,
                      mr: 1,
                    }}
                  />
                  <Typography sx={{ fontSize: 12 }}>
                    {resource?.dislikes}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#F2F1F6",
                m: 2,
                borderRadius: 3,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  Learning Blocks 🧱{" "}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Coming soon, we are thrilled to present our revolutionary
                  Learning Blocks! These powerful building blocks for learning
                  offer customizable discussion questions, video responses, or
                  quizzes which you can easily add to any resource. Manage your
                  learning like never before with Learning Blocks – the next
                  level in learning is just around the corner!
                </Typography>
                {!treeAdmin ? (
                  <Box
                    onClick={() => {
                      mixpanel.track("Learning Blocks");
                      toast.success("Not yet available");
                    }}
                    sx={{
                      mt: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "#00A4FF",
                      cursor: "pointer",
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                      width: 200,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      Learn more
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    onClick={() => {
                      handleOpen();
                    }}
                    sx={{
                      mt: 1,
                      "&:hover": { opacity: 0.7 },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "#00A4FF",
                      cursor: "pointer",
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      p: 1,
                      width: 200,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      Try A Block
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
              Start a Lab Question
            </Typography>
            <Typography sx={{ mt: 2 }}>This is not yet available</Typography>
          </Box>
        </Modal>
      </Drawer>
    </>
  );
}
