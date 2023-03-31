import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  Divider,
  MenuItem,
  LinearProgress,
  TextField,
  Avatar,
} from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  addComment,
  addNodeAttachments,
  autoAddResource,
  deleteComment,
  deleteNodeAttachments,
  getComments,
  getNodeAttachments,
  orderResource,
} from "@/utils/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import AddResourcePopup from "../Popup/AddResourcePopup";

import { toast } from "react-toastify";

import { motion } from "framer-motion";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useSession } from "next-auth/react";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
export default function CommentNodeContent({
  setLoading,
  attachments,
  loading,
  setAttachment,
  treeAdmin,
  resource,
  resouceClickHandler,
  selectedNode,
  tree,
  handleEditNode,
  progress,
  tab,
  setTab,
}) {
  const { data } = useSession();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState();

  function addCommentHandler() {
    if (data && message) {
      const payload = {
        tree_id: tree.id,
        user_id: data.user.id,
        comment: message,
        naufeltree_id: parseInt(selectedNode.id),
      };
      console.log(payload);
      addComment(payload)
        .then((res) => {
          console.log(res);
          setComments(res);
          setMessage("");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  function deleteCommentHandler(id) {
    deleteComment(id).then((res) => {
      console.log(res);
      setComments(res);
    });
  }

  useEffect(() => {
    if (tree) {
      getComments(tree.id).then((res) => {
        console.log(res);
        setComments(res);
      });
    }
  }, []);
  return (
    <Box sx={{ maxWidth: 450, p: 1 }}>
      {" "}
      <Box
        sx={{
          borderRadius: 3,
          display: "flex",
          alignContent: "center",
          mb: 2,
        }}
      >
        {/* <Box component={'img'} width={40} height={40} sx={{ borderRadius: 100, mr: 1, alignSelf: 'center' }} src={selectedNode?.photo} /> */}
        <Box
          sx={{
            display: "flex",
            width: "100%",
            borderRadius: 2,
            p: 1,
            px: 2.1,
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: 25, fontWeight: 700, color: "black" }}
          >
            {selectedNode?.text}
          </Typography>
        </Box>
      </Box>
      {loading && <LinearProgress />}
      <Box sx={{ px: 2.1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Comments</Typography>
      </Box>
      <Box
        sx={{
          maxHeight: 600,
          overflowY: "auto",
          overflowX: "hidden",
          pb: 10,
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
        }}
      >
        {comments.map((res, index) => {
          return (
            <motion.div
              key={index}
              // initial={{ scale: 0 }}
              animate={{ y: 0 }}
              transition={{
                // type: "spring",
                duration: 0.1,
                stiffness: 125,
              }}
            >
              <Box
                sx={{
                  flexDirection: "column",
                  p: 1,
                  backgroundColor: "white",
                  borderRadius: 2,
                  my: 1.1,
                  mx: 1,
                  width: 420,
                  overflow: "hidden",
                  boxShadow:
                    resource?.id != res.id
                      ? "0px 1px 9px rgba(0, 0, 0, 0.09)"
                      : "1px 10px 13px rgba(0, 0, 0, 0.2)",
                  //   "&:hover": {
                  //     boxShadow: "1px 10px 13px rgba(0, 0, 0, 0.04)",
                  //   },
                }}
              >
                {" "}
                <Typography
                  variant="h1"
                  sx={{
                    opacity: 0.7,
                    fontWeight: 500,
                    fontSize: 10,
                    maxWidth: 250,
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {tree.name} | {res.node.label}
                </Typography>
                <Box sx={{ my: 1, display: "flex" }}>
                  <Avatar
                    sx={{ width: 30, height: 30 }}
                    src={res.user.photo_url}
                  />
                  <Box
                    sx={{
                      cursor: "pointer",
                      ml: 2,
                      color: "#black",
                    }}
                  >
                    <>
                      <Typography
                        variant="h1"
                        sx={{
                          fontWeight: 700,
                          fontSize: 14,
                          maxWidth: 250,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}
                      >
                        {res.user.firstname} {res.user.lastname}
                      </Typography>
                    </>
                  </Box>

                  {treeAdmin ? (
                    <Box
                      sx={{
                        "&:hover": { opacity: 0.1 },
                        cursor: "pointer",
                        display: "flex",
                        ml: "auto",
                        justifyContent: "center",
                        alignContent: "center",
                        fontWeight: 700,
                      }}
                    ></Box>
                  ) : (
                    <></>
                  )}
                </Box>
                <Box sx={{ my: 1 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 500,
                      fontSize: 14,

                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {res.comment}
                  </Typography>
                </Box>
                {res.user_id === data.user.id && (
                  <Typography
                    onClick={() => deleteCommentHandler(res.id)}
                    sx={{
                      fontSize: 12,
                      cursor: "pointer",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    Delete
                  </Typography>
                )}
              </Box>
            </motion.div>
          );
        })}
      </Box>
      <Box sx={{ position: "fixed", bottom: 20, width: 430 }}>
        <Box sx={{ display: "flex" }}>
          <TextField
            sx={{ my: 1, flex: 2 }}
            placeholder="Message"
            size="small"
            fullWidth
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Box
            onClick={addCommentHandler}
            sx={{
              flex: 1,
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 0,
              backgroundColor: "#00A4FF",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              my: 1,
              ml: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: "white" }}
            >
              Post
            </Typography>
          </Box>
        </Box>{" "}
        <Box sx={{ display: "flex" }}>
          <Box
            onClick={() => {
              setTab(1);
            }}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              backgroundColor: tab == 2 ? "white" : "grey",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              mr: 1,
              p: 1,
              height: 40,
              alignSelf: "center",
              border: 1,
              borderColor: "#DADADA",
            }}
          >
            <InsertLinkIcon
              sx={{
                fontSize: 20,
                mx: 1,
                color: tab == 2 ? "#151127" : "white",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: tab == 2 ? "#151127" : "white",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Resources
            </Typography>
          </Box>
          <Box
            onClick={() => {
              setTab(2);
            }}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              backgroundColor: "white",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              ml: 1,
              p: 1,
              height: 40,
              alignSelf: "center",
              border: 1,
              borderColor: "#DADADA",
              backgroundColor: tab == 1 ? "white" : "grey",
            }}
          >
            <ChatBubbleRoundedIcon
              sx={{
                color: tab == 1 ? "#151127" : "white",
                fontSize: 20,
                mx: 1,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "#151127",
                fontWeight: 600,
                fontSize: 14,
                alignItems: "center",
                color: tab == 1 ? "#151127" : "white",
              }}
            >
              Community
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
