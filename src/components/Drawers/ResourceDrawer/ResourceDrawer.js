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
  Avatar,
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
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/router";
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
  const router = useRouter();
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
            maxWidth: width >= 450 ? width - 525 : width,
            ml: "auto",
            mr: 5,
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
            sx={{
              position: "fixed",
              zIndex: 100,
              right: 15,
            }}
          >
            <Box
              sx={{
                boxShadow: 5,
                backgroundColor: "white",
                borderRadius: 20,
                py: 0.5,
              }}
            >
              <IconButton
                onClick={() => {
                  setFrame(null);
                  setOpenUrl(false);
                }}
                size="small"
                sx={{
                  color: "#FF7B7B",
                  width: 30,
                  height: 30,
                  display: "flex",
                  m: 1,
                  cursor: "pointer",
                }}
              >
                <Tooltip title="Close" placement="left-start">
                  <CloseIcon />
                </Tooltip>
              </IconButton>

              <IconButton
                onClick={() => {
                  window.open(resource.src);
                }}
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  m: 1,
                  cursor: "pointer",
                }}
              >
                <Tooltip title="Open Link" placement="left-start">
                  <InsertLinkIcon />
                </Tooltip>
              </IconButton>
            </Box>
            <Box
              onClick={() => {
                likeHandler(resource);
              }}
              sx={{
                boxShadow: 5,
                backgroundColor: "white",
                borderRadius: 20,
                mt: 1,
                py: 0.5,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#F1F1F1",
                },
              }}
            >
              <IconButton
                disableRipple={true}
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  m: 1,
                  cursor: "pointer",
                }}
              >
                <Tooltip title="Like" placement="left-start">
                  <FavoriteBorderIcon />
                </Tooltip>
              </IconButton>
            </Box>
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
                <Box
                  sx={{
                    display: "flex",
                    backgroundColor: "white",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, .15)",

                    my: 1,
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="h1"
                      sx={{ fontSize: 20, fontWeight: 600 }}
                    >
                      {resource?.title}
                    </Typography>
                    <Typography
                      variant="body1"
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
                        variant="h1"
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

                  <Box sx={{ p: 1, ml: "auto", display: "flex" }}>
                    <Box
                      sx={{
                        "&:hover": { opacity: 0.7 },
                        display: "flex",
                        cursor: "pointer",
                        justifyContent: "center",
                        alignItems: "center",
                        p: 1,
                      }}
                    >
                      <Tooltip placement="left-start" title="Previous">
                        <ArrowBackIcon sx={{ "&:hover": { opacity: 0.1 } }} />
                      </Tooltip>
                    </Box>
                    <Box
                      onClick={() => {
                        nextHandler();
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
                      <Tooltip placement="right-start" title="Next">
                        <ArrowForwardIcon
                          sx={{ "&:hover": { opacity: 0.1 } }}
                        />
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </>
            </Box>
            {resource?.user && (
              <Box sx={{ display: "flex", p: 2 }}>
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  <Tooltip
                    title={`${resource.user.firstname} ${resource.user.lastname}`}
                  >
                    <Avatar src={resource.user.photo_url} />
                  </Tooltip>
                </Box>
                <Box sx={{ ml: 2, alignSelf: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {resource.user.firstname} {resource.user.lastname}
                  </Typography>
                </Box>
                <Box
                  onClick={() => router.push(`/user/${resource.user.id}`)}
                  sx={{
                    "&:hover": { opacity: 0.7 },
                    borderRadius: 2,
                    display: "flex",
                    backgroundColor: "white",
                    cursor: "pointer",
                    ml: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 100,
                    p: 1,
                    height: 40,
                    alignSelf: "center",
                    border: 1,
                    borderColor: "#DADADA",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: "#151127", fontWeight: 600, fontSize: 14 }}
                  >
                    View Profile
                  </Typography>
                </Box>
              </Box>
            )}
            <Box sx={{ p: 2 }}>
              {/* <Box
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
              </Box> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#F2F1F6",

                borderRadius: 3,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Learning Blocks 🧱{" "}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 12 }}>
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
                    <Typography
                      variant="body1"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
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
                    <Typography
                      variant="body1"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
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
