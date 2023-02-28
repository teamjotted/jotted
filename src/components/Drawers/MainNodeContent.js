import {
  Box,
  Typography,
  IconButton,
  Avatar,
  AvatarGroup,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { orderNodes } from "../../utils/api";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function MainNodeSidebar({
  nextHandler,
  treeDetails,
  selectedNode,
  treeAdmin,
  nodes,
  handleEditNode,
  selectNode,
}) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { width, height } = useWindowDimensions();
  useEffect(() => {
    console.log(selectedNode);
    console.log(nodes);
  }, [selectedNode]);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const srcI = source.index;
    const desI = destination.index;

    nodes.splice(desI, 0, nodes.splice(srcI, 1)[0]);
    //TODO:
    console.log(result);

    // console.log(Object.keys(attachments));

    nodes.map((res, i) => {
      //console.log(res, 'Changing', res.label, 'to', i + 1);

      if (res.type == "mainNode") {
        console.log(res);
        nodes.splice(0, 0, nodes.splice(i, 1)[0]);

        return (res.index = 0);
      } else {
        if (res.index == 0 && i == 1) {
          return (res.index = nodes.length);
        }
        return (res.index = i);
      }
    });

    // for (const key of iterator) {
    // 	console.log(iterator);
    // }
    // console.log(attachments);
    //console.log(updatedAttachments);

    orderNodes(nodes).then((res) => {
      console.log(res);
    });

    //setAttachment(updatedAttachments);
  }
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 3,
        display: "flex",
        alignContent: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",

            borderRadius: 3,
            p: 1,
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: width >= 450 ? 30 : 20,
                fontWeight: 700,
                color: "black",
              }}
            >
              {selectedNode?.text}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "black",
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: width > 450 ? 8 : 3,
              }}
            >
              {treeDetails?.description}
            </Typography>
          </Box>

          <Tooltip title="Options">
            <MoreVertIcon
              aria-expanded={open ? "true" : undefined}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                "&:hover": { opacity: 0.7 },
                ml: "auto",
                display: "flex",
              }}
            />
          </Tooltip>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {treeAdmin && (
            <MenuItem onClick={handleEditNode}>
              <Typography variant="body1">Edit</Typography>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              mixpanel.track("Buy me a coffee", {
                tree_id: treeDetails.id,
                tree_owner: treeDetails.user.id,
              });
              toast.success("Coming soon!");
            }}
          >
            <Typography variant="body1">Buy Me a Coffee</Typography>
          </MenuItem>
          <MenuItem disabled onClick={handleClose}>
            <Typography variant="body1">Share</Typography>
          </MenuItem>
          <MenuItem disabled onClick={handleClose}>
            <Typography variant="body1">Report</Typography>
          </MenuItem>
          <Divider />
        </Menu>
        <Box sx={{ m: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{}}>
            <Typography
              variant="h5"
              sx={{ fontSize: 12, fontWeight: 600, color: "black" }}
            >
              Created by {treeDetails?.user.firstname}{" "}
              {treeDetails?.user.lastname}
            </Typography>
            {/* {treeDetails?.shared_users.length > 0 && (
              <Typography sx={{ fontSize: 12 }}>
                w/ {treeDetails.shared_users.length} Collaborators
              </Typography>
            )} */}
          </Box>
          <Box sx={{ display: "flex" }}>
            <AvatarGroup sx={{ cursor: "pointer" }} max={4}>
              <Tooltip
                onClick={() => {
                  router.push(`/user/${treeDetails?.user.id}`);
                }}
                title={`${treeDetails?.user.firstname} ${treeDetails?.user.lastname}`}
              >
                <Avatar
                  sx={{ width: 30, height: 30 }}
                  src={
                    treeDetails?.user.photo_url != ""
                      ? treeDetails?.user.photo_url
                      : null
                  }
                  alt={treeDetails?.user.firstname}
                >
                  {treeDetails?.user.photo_url == ""
                    ? `${treeDetails?.user.firstname[0]}`
                    : ""}
                </Avatar>
              </Tooltip>
              {treeDetails?.shared_users.map((res) => {
                return (
                  <>
                    <Tooltip
                      onClick={() => {
                        router.push(`/user/${res.shared_user?.id}`);
                      }}
                      title={`${res.shared_user?.firstname} ${res.shared_user?.lastname}`}
                    >
                      <Avatar
                        sx={{ width: 30, height: 30, cursor: "pointer" }}
                        src={res.shared_user?.photo_url}
                      >
                        {res.shared_user?.photo_url == ""
                          ? `${res.shared_user?.firstname[0]}`
                          : ""}
                      </Avatar>
                    </Tooltip>
                  </>
                );
              })}
            </AvatarGroup>
          </Box>
        </Box>
        <Box
          onClick={() => {
            nextHandler();
            mixpanel.track("Start Map", {
              tree_id: treeDetails.id,
              tree_owner: treeDetails.user.id,
            });
          }}
          sx={{
            "&:hover": { opacity: 0.7 },
            borderRadius: 2,
            display: "flex",
            boxShadow: 0,
            backgroundColor: "black",
            cursor: "pointer",
            mr: 1,
            justifyContent: "center",
            alignItems: "center",
            p: 1,
            my: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500, color: "white" }}>
            Start Map
          </Typography>
        </Box>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-1">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  maxHeight: 450,
                  overflowY: "auto",
                  overflowX: "hidden",
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
                {nodes.map((res, index) => (
                  <>
                    {res.type != "mainNode" ? (
                      <Draggable
                        key={res.id}
                        draggableId={"draggable-" + res.id}
                        index={index}
                      >
                        {(provided) => (
                          <motion.div
                            // initial={{ scale: 0 }}
                            animate={{ y: 0 }}
                            transition={{
                              // type: "spring",
                              duration: 0.2,
                              stiffness: 150,
                            }}
                            whileHover={{ y: -1.5 }}
                          >
                            <Box
                              onClick={() => selectNode(res)}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={treeAdmin ? provided.innerRef : null}
                              sx={{
                                flexDirection: "column",
                                p: 1,
                                borderRadius: 2,
                                my: 1.1,
                                mx: 1,
                                display: "flex",
                                backgroundColor: "white",
                                maxWidth: 470,
                                overflow: "hidden",
                                boxShadow: "0px 1px 9px rgba(0, 0, 0, 0.09)",
                                "&:hover": {
                                  boxShadow: "0px 1px 9px rgba(0, 0, 0, 0.16)",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  "&:hover": {
                                    color:
                                      res.type == "mainNode" ? "" : "#00A4FF",
                                  },
                                }}
                              >
                                <Box
                                  component={"img"}
                                  width={50}
                                  height={50}
                                  sx={{
                                    borderRadius: 2,
                                    mr: 1,
                                    alignSelf: "center",
                                  }}
                                  src={res.photo}
                                />
                                <Box sx={{ cursor: "pointer", ml: 2 }}>
                                  <>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 800,
                                        fontSize: 12,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                      }}
                                    >
                                      {res.index} | {res.data.label}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: 12,
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 2,
                                      }}
                                    >
                                      {res.description}
                                    </Typography>
                                  </>
                                </Box>
                              </Box>
                            </Box>
                          </motion.div>
                        )}
                      </Draggable>
                    ) : (
                      <></>
                    )}
                  </>
                ))}
                {provided.placeholder}{" "}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
}
