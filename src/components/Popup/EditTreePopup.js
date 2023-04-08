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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MuiChipsInput } from "mui-chips-input";
import { useState } from "react";
import { useEffect } from "react";
import { deleteTree, getTags } from "../../utils/api";
import { media } from "../../mock/TreePhotos";
import Carousel from "react-material-ui-carousel";
import { useRouter } from "next/router";
import UploadWidget from "../UploadWidget";

export const DISCIPLINE_DATA_ARRAY = [
  "Search Engine Optimization",
  "Social Media Marketing",
  "Content Marketing",
  "Email Marketing",
  "Mobile Marketing",
  "Marketing Analytics",
  "Affiliate Marketing",
  "Other",
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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

export default function EditTreePopup({
  tag,
  setTag,
  saveTree,
  open,
  handleClose,
  treeDetails,
  editedTree,
  setEditedTree,
  classes,
}) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [deleteSure, setDeleteSure] = useState(false);
  useEffect(() => {
    // getTags().then((res) => {
    // 	console.log(
    // 		res.data.map((map) => {
    // 			setTags((prev) => [...prev, map.name]);
    // 		})
    // 	);
    // });
    setEditMode(false);
    console.log(media);
    // console.log(tags);
    if (editedTree.tags.length > 0) {
      console.log(editedTree.tags);
      setTag(editedTree.tags);
    }
  }, []);

  function photoHandler(e) {
    // console.log(media[e]);
    const photo = media[e];
    setEditedTree({ photo: photo.photo });
  }

  function deleteHandler() {
    console.log(treeDetails.id);
    setDeleteSure(true);
  }
  function deleteTreeHandler() {
    console.log("deleting", treeDetails.id);
    deleteTree(treeDetails.id);
    setDeleteSure(true);
    router.push(`/user/${treeDetails.user_id}`);
    //navigate(ROUTES.AUTHHOME);
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {!deleteSure ? (
        <Box sx={style}>
          <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Edit Tree
            </Typography>
            <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            value={editedTree.name}
            onChange={(e) => {
              setEditedTree({ name: e.target.value });
            }}
            sx={{ my: 1 }}
            label="Tree Name"
            defaultValue={treeDetails?.name}
            fullWidth
            size="small"
          />
          {treeDetails.photo ? (
            <>
              {!editMode ? (
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
                    src={treeDetails.photo}
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
              ) : (
                <>
                  <Box
                    onClick={() => {
                      setEditMode(!editMode);
                      setEditedTree({ photo: treeDetails.photo });
                    }}
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
                      p: 1,
                    }}
                  >
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      Nevermind
                    </Typography>
                  </Box>
                  {/* <UploadWidget tree_id={treeDetails.id} /> */}

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
          {/* <FormControl sx={{ m: 1, width: 350 }}>
					<InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
					<Select
						fullWidth
						size="small"
						labelId="demo-multiple-chip-label"
						id="demo-multiple-chip"
						multiple
						value={tag}
						onChange={(e) => {
							setTag(e.target.value);
						}}
						input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
						renderValue={(selected) => (
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
								{selected.map((value) => (
									<Chip key={value} label={value} />
								))}
							</Box>
						)}
						MenuProps={MenuProps}>
						{tags.map((tag) => (
							<MenuItem key={tag} value={tag}>
								{tag}
							</MenuItem>
						))}
					</Select>
				</FormControl> */}
          <MuiChipsInput
            fullWidth
            style={{ maxHeight: 150, overflowY: "scroll" }}
            placeholder="Add Tags"
            helperText="Press enter to confirm and save"
            value={tag}
            onChange={(e) => {
              console.log(e);
              setTag(e);
            }}
          />
          <TextField
            value={editedTree.description}
            onChange={(e) => {
              setEditedTree({ description: e.target.value });
            }}
            sx={{ my: 1 }}
            label="Description"
            multiline
            rows={4}
            defaultValue={treeDetails?.description}
            fullWidth
            size="small"
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editedTree.category}
              label="Category"
              onChange={(e) => {
                setEditedTree({ category: e.target.value });
              }}
            >
              {DISCIPLINE_DATA_ARRAY.map((item, i) => (
                <MenuItem value={item} key={i + 1}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex" }}>
            <Box
              onClick={deleteHandler}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                boxShadow: 0,

                borderColor: "red",
                cursor: "pointer",
                mr: 1,
                justifyContent: "center",
                alignItems: "center",
                p: 1,
                mt: 2,
              }}
            >
              <Typography sx={{ color: "red", fontWeight: 600 }}>
                Delete Map
              </Typography>
            </Box>
            <Box
              onClick={saveTree}
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
                p: 1,
                mt: 2,
                flex: 1,
                ml: 1,
              }}
            >
              <Typography sx={{ color: "white", fontWeight: 600 }}>
                Save
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={style}>
          <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
            Are you sure you want to delete this tree?
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
              onClick={deleteTreeHandler}
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
