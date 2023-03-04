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
import { useEffect, useState } from "react";
import AddResourcePopup from "../Popup/AddResourcePopup";

import { toast } from "react-toastify";

import { motion } from "framer-motion";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";

export default function SubNodeContent({
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
}) {
  const { width, height } = useWindowDimensions();
  // Dropdown for Node
  const [anchorEl, setAnchorEl] = useState(null);
  const [url, setUrl] = useState();
  const handleCloseNodeSettings = () => {
    setAnchorEl(null);
  };
  const handleOpenNodeSettings = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const openSettings = Boolean(anchorEl);

  //Node Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    // setSelectedResource();
  };

  const [selectedResource, setSelectedResource] = useState();

  // Dropdown for Attachments
  const [anchorElAttachments, setAnchorElAttachments] = useState(null);
  const handleCloseAttachmentDropdown = () => {
    setAnchorElAttachments(null);
  };
  const handleOpenAttachmentDropdown = (event, res) => {
    console.log(res);
    setSelectedResource(res);
    setAnchorElAttachments(event.currentTarget);
  };

  // const handleOpenAttachmentDropdown = () => setAttachmentDropdown(true);
  // const handleCloseAttachmentDropdown = () => setAttachmentDropdown(false);

  const [onFocus, setOnFocus] = useState();
  const openAttachmentsDropdown = Boolean(anchorElAttachments);

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
    setLoading(true);
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
    orderResource({
      resource: attachments,
      node_id: attachments[0].node_id,
    }).then((res) => {
      console.log(res);
      setAttachment(res);
      setLoading(false);
    });

    //setAttachment(updatedAttachments);
  }
  function deleteResoueceHandler() {
    setLoading(true);
    console.log(selectedResource);
    deleteNodeAttachments(selectedResource.id).then((res) => {
      console.log(res);
      toast.info("Resource Deleted");
      handleCloseAttachmentDropdown();
      getNodeAttachments(selectedResource.node_id).then((res) => {
        console.log(res);
        setAttachment(res?.data);
        setLoading(false);
      });
    });
  }
  function handleEditAttachment() {
    console.log("Editing:", selectedResource);
    //setSelectedResource(res);
    setOpen(true);
  }

  useEffect(() => {
    console.log(open);
    console.log(anchorElAttachments);
    // if (anchorElAttachments === false) {
    //   setSelectedResource(null);
    // }
    // if (open == "false") {
    //   setSelectedResource();
    // }
  }, [anchorElAttachments]);
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
      {loading && <LinearProgress />}
      <Box sx={{ p: 2 }}>
        {attachments.length == 0 && !loading ? (
          <>
            <Typography variant="body1">
              This node contains no resources.
            </Typography>
          </>
        ) : (
          <></>
        )}
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
              {attachments.map((res, index) => (
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
                        duration: 0.1,
                        stiffness: 125,
                      }}
                      whileHover={{ y: -1.5 }}
                    >
                      <Box
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={treeAdmin ? provided.innerRef : null}
                        sx={{
                          flexDirection: "column",
                          p: 1,
                          backgroundColor: "white",
                          borderRadius: 2,
                          my: 1.1,
                          mx: 1,
                          display: "flex",
                          maxWidth: 470,
                          overflow: "hidden",
                          boxShadow:
                            resource?.id != res.id
                              ? "0px 1px 9px rgba(0, 0, 0, 0.09)"
                              : "1px 10px 13px rgba(0, 0, 0, 0.2)",
                          "&:hover": {
                            boxShadow: "1px 10px 13px rgba(0, 0, 0, 0.15)",
                          },
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
                              if (width > 800) {
                                resouceClickHandler(res);
                              } else {
                                window.open(res.src);
                              }
                            }}
                            sx={{
                              cursor: "pointer",
                              ml: 2,
                              color: "#black",
                            }}
                          >
                            <>
                              <Typography
                                variant="body2"
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
                                variant="body2"
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
                                {res.index + 1} | {res.title}
                              </Typography>
                              <Typography
                                variant="body2"
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
                              sx={{
                                "&:hover": { opacity: 0.1 },
                                cursor: "pointer",
                                display: "flex",
                                ml: "auto",
                                justifyContent: "center",
                                alignContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              <Tooltip title="Resource Settings">
                                <MoreVertIcon
                                  onClick={(e) =>
                                    handleOpenAttachmentDropdown(e, res)
                                  }
                                  sx={{
                                    ml: "auto",
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          ) : (
                            <></>
                            // <Tooltip
                            //   onClick={() => {
                            //     window.open(res.src);
                            //   }}
                            //   title="Go to Link"
                            // >
                            //   <InsertLinkIcon
                            //     sx={{
                            //       "&:hover": { opacity: 0.1 },
                            //       ml: "auto",
                            //       color: "black",
                            //     }}
                            //   />
                            // </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Menu
        anchorEl={anchorElAttachments}
        id="account-menu"
        open={openAttachmentsDropdown}
        onClose={handleCloseAttachmentDropdown}
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
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        <>
          {treeAdmin && (
            <MenuItem onClick={handleEditAttachment}>
              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Edit
              </Typography>
            </MenuItem>
          )}
          <MenuItem onClick={deleteResoueceHandler}>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Delete
            </Typography>
          </MenuItem>
          <MenuItem disabled>
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              Report
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseAttachmentDropdown}>
            <Typography variant="body2">Close</Typography>
          </MenuItem>
        </>
      </Menu>
      <Box>
        {treeAdmin && (
          <Box
            onClick={() => {
              handleOpen();
              setSelectedResource();
            }}
            sx={{
              "&:hover": {
                opacity: 0.7,
              },
              cursor: "pointer",
              display: "flex",
              width: 150,
              alignItems: "center",
            }}
          >
            <IconButton>
              <Tooltip placement="right" title="Add Resource">
                <AddIcon />
              </Tooltip>
            </IconButton>
            {/* <TextField
              sx={{ my: 1 }}
              placeholder="Paste Url"
              size="small"
              fullWidth
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            /> */}
            <Typography
              variant="subtitle"
              sx={{ fontWeight: 600, color: "grey" }}
            >
              Add Resource
            </Typography>
          </Box>
        )}
      </Box>
      <AddResourcePopup
        selectedResource={selectedResource}
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
