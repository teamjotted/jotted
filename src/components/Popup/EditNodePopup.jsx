import {
  MenuItem,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Chip,
  OutlinedInput,
  CardMedia,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MuiChipsInput } from "mui-chips-input";
import { useState } from "react";
import { useEffect } from "react";
import {
  deleteNode,
  deleteTree,
  editNodeDetails,
  getNodeByTreeId,
  getTags,
} from "../../utils/api";
import { media } from "../../mock/NodePhotos";
import Carousel from "react-material-ui-carousel";
import { toast } from "react-toastify";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditNodePopup({
  toggleDrawer,
  handleClosePanel,
  dispatch,
  open,
  handleClose,
  treeDetails,
  selectedNode,
  setSelectedNode,
  classes,
  setNodes,
}) {
  const [editMode, setEditMode] = useState(false);
  const [deleteSure, setDeleteSure] = useState(false);

  function photoHandler(e) {
    // console.log(media[e]);
    const photo = media[e];
    // setEditedTree({ photo: photo.photo });
    setSelectedNode((prevState) => ({ ...prevState, photo: photo.photo }));
  }

  function deleteHandler() {
    console.log(treeDetails.id);
    setDeleteSure(true);
  }

  function editNode() {
    editNodeDetails(selectedNode.id, selectedNode.text, selectedNode.photo)
      .then((res) => {
        console.log(res);
        toast.success("Node Saved");
        handleClose();
      })
      .catch((error) => {
        toast.error("Cannot save, please try again!");
        handleClose();
      });
    getNodeByTreeId(treeDetails.id).then((res) => {
      console.log(res);
      setNodes(res);
      //setSelectedNode(res)
    });
  }

  const deleteTopic = () => {
    // console.log('DELETE NODE', data);
    deleteNode(selectedNode.id, treeDetails.id, dispatch).then((res) => {
      console.log(res);
      handleClose();
      toggleDrawer(false);
      // setNode(res.data);
      getNodeByTreeId(treeDetails.id).then((res) => {
        console.log(res);
        setNodes(res);
        //setSelectedNode(res)
      });
    });
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {!deleteSure ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 598,
            bgcolor: "#F2F2F2",
            borderRadius: 5,
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Edit Node</Typography>
          <TextField
            onChange={(e) => {
              setSelectedNode((prevState) => ({
                ...prevState,
                text: e.target.value,
              }));
            }}
            value={selectedNode?.text}
            sx={{ my: 1 }}
            label="Node Name"
            defaultValue={selectedNode?.text}
            fullWidth
            size="small"
          />
          {selectedNode.photo ? (
            <>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "center",
                  my: 1,
                }}
              >
                Change Node Image
              </Typography>
              {!editMode ? (
                <>
                  <Box
                    onClick={() => {
                      console.log(editMode);
                      setEditMode(!editMode);
                    }}
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    <Box
                      sx={{ justifyContent: "center" }}
                      component={"img"}
                      width={200}
                      height={200}
                      src={selectedNode?.photo}
                    />
                    <Typography
                      sx={{
                        position: "absolute",
                        color: "white",
                        fontWeight: 800,
                        fontSize: 30,
                      }}
                    >
                      {" "}
                      Edit{" "}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    onClick={() => {
                      handleClose();
                      // setSelectedNode((prevState) => ({ ...prevState, photo: selectedNode.photo }));
                    }}
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
                      p: 1,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      Nevermind
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Carousel
                      onChange={photoHandler}
                      navButtonsAlwaysVisible={true}
                      indicators={false}
                      cycleNavigation={false}
                      height={100}
                      autoPlay={false}
                    >
                      {media.map((item, i) => (
                        <Box
                          sx={{ justifyContent: "center", display: "flex" }}
                          key={i}
                        >
                          <Box
                            sx={{ justifyContent: "center" }}
                            component={"img"}
                            width={100}
                            height={100}
                            src={item.photo}
                          />
                        </Box>
                      ))}
                    </Carousel>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Box sx={{ p: 2 }}>
              <Carousel
                onChange={photoHandler}
                navButtonsAlwaysVisible={true}
                indicators={false}
                cycleNavigation={false}
                height={100}
                autoPlay={false}
              >
                {media.map((item, i) => (
                  <Box
                    sx={{ justifyContent: "center", display: "flex" }}
                    key={i}
                  >
                    <Box
                      sx={{ justifyContent: "center" }}
                      component={"img"}
                      width={100}
                      height={100}
                      src={item.photo}
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          )}

          <Box sx={{ display: "flex" }}>
            <Box
              onClick={deleteHandler}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                border: 1,
                borderColor: "red",
                cursor: "pointer",
                mr: 1,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                mt: 2,
                flex: 1,
              }}
            >
              <Typography sx={{ color: "#FC5555", fontWeight: 500 }}>
                Delete Node
              </Typography>
            </Box>
            <Box
              onClick={editNode}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",

                backgroundColor: "#00A4FF",
                cursor: "pointer",
                mr: 1,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                mt: 2,
                flex: 1,
                ml: 1,
              }}
            >
              <Typography sx={{ color: "white", fontWeight: 500 }}>
                Save
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={style}>
          <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
            Are you sure you want to delete this node?
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
            All nodes and assigned resources will be delete and unable to be
            recovered
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Box
              onClick={() => {
                handleClose();
                setDeleteSure(false);
              }}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                boxShadow: 0,

                cursor: "pointer",
                mr: 1,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                mt: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Cancel</Typography>
            </Box>
            <Box
              onClick={deleteTopic}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                boxShadow: 0,
                backgroundColor: "red",
                cursor: "pointer",
                mr: 1,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                mt: 2,
                flex: 1,
                ml: 1,
              }}
            >
              <Typography sx={{ color: "white", fontWeight: 600 }}>
                Delete
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  );
}
