import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  Divider,
  MenuItem,
} from "@mui/material";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  deleteNodeAttachments,
  getNodeAttachments,
  orderResource,
} from "@/utils/api";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import AddResourcePopup from "../Popup/AddResourcePopup";

import { toast } from "react-toastify";

export default function SubNodeContent({
  attachments,
  setAttachment,
  treeAdmin,
  resource,
  resouceClickHandler,
  selectedNode,
  tree,
  handleEditNode,
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openSettings = Boolean(anchorEl);
  const handleCloseNodeSettings = () => {
    setAnchorEl(null);
  };
  const handleOpenNodeSettings = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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

    attachments.splice(desI, 0, attachments.splice(srcI, 1)[0]);
    //TODO:
    console.log(result);

    // console.log(Object.keys(attachments));

    const updatedAttachments = attachments.map((res, i) => {
      console.log(res, "Changing", res.index, "to", i);

      return (res.index = i);
    });

    // for (const key of iterator) {
    // 	console.log(iterator);
    // }
    // console.log(attachments);
    //console.log(updatedAttachments);
    orderResource(attachments);

    //setAttachment(updatedAttachments);
  }
  function deleteResoueceHandler(resource) {
    deleteNodeAttachments(resource.id).then((res) => {
      console.log(res);
      toast.info("Resource Deleted");
      getNodeAttachments(resource.node_id).then((res) => {
        setAttachment(res.data);
      });
    });
  }

  return (
    <Box sx={{ maxWidth: 450, p: 1 }}>
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
            backgroundColor: "#F2F1F6",
            display: "flex",
            width: "100%",
            borderRadius: 2,
            p: 1,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 25, fontWeight: 700, color: "black" }}>
            {selectedNode?.text}
          </Typography>
          <MoreVertIcon
            onClick={handleOpenNodeSettings}
            sx={{ ml: "auto", cursor: "pointer", textAlign: "center" }}
          />
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openSettings}
            onClose={handleCloseNodeSettings}
            // onClick={}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <>
              {treeAdmin && (
                <MenuItem>
                  <Typography
                    sx={{ textAlign: "center" }}
                    onClick={handleEditNode}
                  >
                    Edit Node
                  </Typography>
                </MenuItem>
              )}
              <MenuItem disabled onClick={handleEditNode}>
                <Typography sx={{ textAlign: "center" }}>Share Node</Typography>
              </MenuItem>
              <MenuItem disabled onClick={handleEditNode}>
                <Typography sx={{ textAlign: "center" }}>Report</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleCloseNodeSettings}>Close</MenuItem>
            </>
          </Menu>
        </Box>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                maxHeight: 600,
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
              {attachments.map((res, index) => (
                <Draggable
                  key={res.id}
                  draggableId={"draggable-" + res.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      sx={{
                        flexDirection: "column",
                        p: 1,
                        backgroundColor:
                          resource?.id != res.id ? "#F2F1F6" : "#00A4FF",
                        borderRadius: 2,
                        my: 1,
                        display: "flex",
                        maxWidth: 470,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                        }}
                      >
                        <Box
                          component={"img"}
                          width={75}
                          height={75}
                          sx={{
                            borderRadius: 2,
                            mr: 1,
                            alignSelf: "center",
                            backgroundColor: "white",
                          }}
                          src={res.preview_url}
                        />
                        <Box
                          onClick={() => {
                            resouceClickHandler(res);
                          }}
                          sx={{
                            cursor: "pointer",
                            ml: 2,
                            "&:hover": {
                              color: "#00A4FF",
                            },
                            color: resource?.id == res.id ? "white" : "",
                          }}
                        >
                          <>
                            <Typography
                              sx={{
                                fontSize: 10,
                                maxWidth: 250,
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                              }}
                            >
                              {res.src}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: 12,
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                maxWidth: 250,
                              }}
                            >
                              {res.title}
                            </Typography>
                            <Typography
                              sx={{
                                maxWidth: 250,
                                fontSize: 10,
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
                        {treeAdmin ? (
                          <Box
                            onClick={() => deleteResoueceHandler(res)}
                            sx={{
                              "&:hover": { opacity: 0.1 },
                              cursor: "pointer",
                              mr: 1,
                              display: "flex",
                              ml: "auto",
                              justifyContent: "center",
                              alignContent: "center",
                              fontWeight: 700,
                            }}
                          >
                            <Tooltip title="Delete Resource">
                              <DeleteIcon />
                            </Tooltip>
                          </Box>
                        ) : (
                          <Tooltip
                            onClick={() => {
                              window.open(res.src);
                            }}
                            title="Go to Link"
                          >
                            <InsertLinkIcon
                              sx={{
                                "&:hover": { opacity: 0.1 },
                                ml: "auto",
                                color:
                                  resource?.id == res.id ? "white" : "black",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box>
        {treeAdmin && (
          <IconButton sx={{ cursor: "pointer" }} onClick={handleOpen}>
            <AddIcon />
          </IconButton>
        )}
      </Box>
      <AddResourcePopup
        open={open}
        handleClose={handleClose}
        attachments={attachments}
        tree={tree}
        node={selectedNode}
        setAttachment={setAttachment}
      />
    </Box>
  );
}
