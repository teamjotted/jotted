import React, { useState, useEffect, useRef, useCallback } from "react";
// import ReactTags from "react-tag-autocomplete";
import {
  Box,
  Button,
  Fab,
  Menu,
  Stack,
  TextField,
  Typography,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Modal,
  Switch,
  MenuItem,
  MenuList,
  ListItemIcon,
  ListItemText,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Divider,
  IconButton,
} from "@mui/material";
import cookie from "cookiejs";
import CloseIcon from "@mui/icons-material/Close";
import {
  getUserById,
  getUserEmail,
  saveUserTree,
  saveUserTreePrivacy,
  shareMyTree,
} from "../../utils/api";
import { MuiChipsInput } from "mui-chips-input";
import { toast } from "react-toastify";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { borderColor } from "@mui/system";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Sharepopup({
  openShare,
  tree,
  setOpenShare,
  setTreeDetails,
  setEditedTree,
  classes,
}) {
  // const [suggestions, setSuggestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [invited, setInvited] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [role, setRole] = useState();
  const [tab, setTab] = useState("invite");
  const [selectedUser, setSelectedUser] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event, user) => {
    setSelectedUser(user);
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setSelectedUser();
    setAnchorEl(null);
  };

  // useEffect(() => {
  // 	document.querySelector('.react-tags__search-input').style = 'min-width: 100%';
  // });

  useEffect(() => {
    console.log(tree);
    setUsers([]);
    setInvited([]);
    if (tree) {
      if (tree.shared_users.length > 0) {
        for (let i = 0; i < tree?.shared_users.length; i++) {
          console.log(tree.shared_users[i]);
          getUserById(tree.shared_users[i].user_id).then((res) => {
            console.log(res);
            if (res) {
              setInvited((prev) => [
                ...prev,
                {
                  user_id: res.id,
                  email: res.email,
                  photo_url: res.photo_url,
                  role: tree.shared_users[i].role,
                },
              ]);
            }
          });
        }
      }
    }
  }, [openShare]);

  const accessHandler = (access) => {
    const privacy = {
      tree_id: tree.id,
      isPublic: access,
    };
    saveUserTreePrivacy(tree.id, privacy)
      .then((res) => {
        console.log(res);
        if (res.isPublic) {
          toast.success("Tree is now public!");
        } else {
          toast.info("Tree is now private!");
        }
        setEditedTree(res);
        // handleClose();
      })
      .catch((e) => {
        console.log(e);
        toast.error("Tree cannot not be changed at this time!");
      });
  };

  const shareHandler = () => {
    console.log(invited);
    shareMyTree(invited, tree.id)
      .then((res) => {
        console.log(res.data);
        setTreeDetails(res.data);
        setEditedTree({ shared_users: res.data.shared_users });
        toast.success("Saved");
        setOpenShare(false);
      })
      .catch((e) => {
        console.log(e);
        setOpenShare(false);
      });
  };
  // useEffect(() => {
  // 	console.log(users[users.length - 1]);
  // }, [users]);

  function addUserHandler(e) {
    const exist = invited.find(({ email }) => e == email);
    console.log("USER EXIST?", exist);
    if (!exist) {
      getUserEmail(e)
        .then((res) => {
          console.log(res);
          setInvited((prev) => [
            ...prev,
            {
              user_id: res.user.id,
              email: res.user.email,
              photo_url: res.user.photo_url,
              role: "viewer",
            },
          ]);
          console.log(invited);
        })
        .catch((e) => {
          toast.error("User does not exist!");
          setUsers(users.filter((item) => item.email !== e));
        });
      console.log(e);
    } else {
      console.log("USER EXIST?", exist);
      setUsers();
    }
  }
  function handleRoleChange(e, user) {
    if (e == "remove") {
      setInvited(invited.filter((item) => item.email !== user.email));

      handleClose();
      return;
    }
    console.log(invited);
    user.role = e;
    handleClose();
  }
  return (
    <>
      <Modal open={openShare} onClose={() => setOpenShare(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {/* <span onClick={() => setOpenShare(false)}>
						<CloseIcon />
					</span> */}
          {tab == "invite" && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                  Share
                </Typography>
                <IconButton
                  onClick={() => {
                    setOpenShare(false);
                  }}
                  sx={{ ml: "auto" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography sx={{ fontWeight: 500, fontSize: 12, my: 1 }}>
                {" "}
                Control access by adding or removing emails from field below{" "}
              </Typography>

              <Box sx={{ mt: 1, maxHeight: 300 }}>
                <MuiChipsInput
                  size="small"
                  fullWidth
                  style={{ maxHeight: 100, overflowY: "auto" }}
                  placeholder="Collaborator Emails: (example@gmail.com)"
                  helperText="Press enter to confirm and save"
                  value={users}
                  onDeleteChip={(e) => {
                    console.log("Deleting", e);
                  }}
                  onAddChip={addUserHandler}
                  onChange={(e) => {
                    setUsers(e);
                  }}
                />
              </Box>
              <Box
                sx={{
                  my: 1,
                  height: 100,
                  overflow: "hidden",
                  overflowY: "auto",
                }}
              >
                <Box sx={{ display: "flex" }}>
                  <Avatar
                    sx={{
                      fontSize: 12,
                      width: 25,
                      alignSelf: "center",
                      height: 25,
                    }}
                    src={tree.user?.photo_url}
                  />
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      textAlign: "center",
                      alignSelf: "center",
                      ml: 2,
                    }}
                  >
                    {tree.user?.email}
                  </Typography>
                  <MenuItem sx={{ ml: "auto" }} onClick={(e) => handleClick(e)}>
                    <Typography>Owner</Typography>
                    {/* <KeyboardArrowDownIcon /> */}
                  </MenuItem>
                  {/* {selectedUser && (
										<Menu
											id={`basic-menu-${selectedUser?.id}`}
											anchorEl={anchorEl}
											open={open}
											onClose={handleClose}
											MenuListProps={{
												'aria-labelledby': 'basic-button'
											}}>
											{selectedUser?.role == 'viewer' && (
												<>
													<MenuItem value={index} sx={{ backgroundColor: '#F2F1F6' }}>
														Viewer
													</MenuItem>
													<MenuItem value={index} onClick={() => handleRoleChange('editor', selectedUser)}>
														Editor
													</MenuItem>
													<Divider />
													<MenuItem value={index} onClick={() => handleRoleChange('remove', selectedUser)}>
														Remove access
													</MenuItem>
												</>
											)}
											{selectedUser?.role == 'editor' && (
												<>
													{' '}
													<MenuItem value={index} onClick={() => handleRoleChange('viewer', selectedUser)}>
														Viewer
													</MenuItem>
													<MenuItem value={index} sx={{ backgroundColor: '#F2F1F6' }}>
														Editor
													</MenuItem>
													<Divider />
													<MenuItem value={index} onClick={() => handleRoleChange('remove', selectedUser)}>
														Remove access
													</MenuItem>
												</>
											)}
										</Menu>
									)} */}
                </Box>
                {invited.map((res, index) => {
                  return (
                    <Box sx={{ display: "flex" }}>
                      <Avatar
                        sx={{
                          fontSize: 12,
                          width: 25,
                          alignSelf: "center",
                          height: 25,
                        }}
                        src={res.photo_url}
                      />
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 500,
                          textAlign: "center",
                          alignSelf: "center",
                          mx: 2,
                        }}
                      >
                        {res?.email}
                      </Typography>
                      <MenuItem
                        sx={{ ml: "auto" }}
                        onClick={(e) => handleClick(e, res)}
                      >
                        {res.role == "viewer" && (
                          <Typography>Viewer</Typography>
                        )}
                        {res.role == "editor" && (
                          <Typography>Editor</Typography>
                        )}
                        <KeyboardArrowDownIcon />
                      </MenuItem>
                      {selectedUser && (
                        <Menu
                          id={`basic-menu-${selectedUser?.id}`}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          {selectedUser?.role == "viewer" && (
                            <>
                              <MenuItem
                                value={index}
                                sx={{ backgroundColor: "#F2F1F6" }}
                              >
                                Viewer
                              </MenuItem>
                              <MenuItem
                                value={index}
                                onClick={() =>
                                  handleRoleChange("editor", selectedUser)
                                }
                              >
                                Editor
                              </MenuItem>
                              <Divider />
                              <MenuItem
                                value={index}
                                onClick={() =>
                                  handleRoleChange("remove", selectedUser)
                                }
                              >
                                Remove access
                              </MenuItem>
                            </>
                          )}
                          {selectedUser?.role == "editor" && (
                            <>
                              {" "}
                              <MenuItem
                                value={index}
                                onClick={() =>
                                  handleRoleChange("viewer", selectedUser)
                                }
                              >
                                Viewer
                              </MenuItem>
                              <MenuItem
                                value={index}
                                sx={{ backgroundColor: "#F2F1F6" }}
                              >
                                Editor
                              </MenuItem>
                              <Divider />
                              <MenuItem
                                value={index}
                                onClick={() =>
                                  handleRoleChange("remove", selectedUser)
                                }
                              >
                                Remove access
                              </MenuItem>
                            </>
                          )}
                        </Menu>
                      )}
                    </Box>
                  );
                })}
              </Box>
              <Divider sx={{ mt: "auto" }} />
              <Box sx={{ display: "flex" }}>
                <Typography sx={{ alignSelf: "center" }}>
                  Public to Community
                </Typography>
                <Switch
                  value={tree.isPublic}
                  onChange={(e) => {
                    accessHandler(e.target.checked);
                  }}
                  sx={{ alignSelf: "center" }}
                />
              </Box>
              <Stack
                direction={"row"}
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
                <Box
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://jotted.page/map/${tree.id}`
                    ) + toast.success("Linked Copied");
                  }}
                  sx={{
                    "&:hover": { opacity: 0.7 },
                    borderRadius: 2,
                    display: "flex",
                    boxShadow: 0,
                    backgroundColor: "#F2F1F6",
                    cursor: "pointer",
                    mr: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                    border: 1,
                    borderColor: "#DADADA",
                  }}
                >
                  <ContentCopyIcon sx={{ mx: 1 }} />
                  <Typography
                    sx={{ color: "black", fontWeight: 600, color: "#1D1D1D" }}
                  >
                    Copy link
                  </Typography>
                </Box>
                <Box
                  onClick={() => shareHandler()}
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
                  <Typography sx={{ color: "white", fontWeight: 500 }}>
                    Done
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
