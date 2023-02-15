import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Fab,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Header({
  user,
  treeadmin,
  onClick,
  treeDetails,
  editHandleOpen,
  shareHandleOpen,
  isFavourite,
  removeFavourite,
  markFavourite,
  search,
  setSearch,
  scrollRef,
  seachHandler,
}) {
  //const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [toggleE, setToggleE] = useState(false);
  const router = useRouter();
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // useEffect(() => {
  // 	if (treeDetails) {
  // 		// mixpanel.people.append('trees_visited', { name: treeDetails?.name, id: treeDetails?.id });

  // 		mixpanel.track('Tree Visted', {
  // 			tree_name: treeDetails?.name,
  // 			tree_id: treeDetails?.id,
  // 			user: user?.id
  // 		});
  // 	}
  // }, [treeDetails]);
  return (
    <Box
      sx={{
        height: "auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        background: "white",
        padding: "5px",
      }}
    >
      <Box
        onClick={() => {
          router.push("/");
        }}
        sx={{ px: 3, cursor: "pointer" }}
      >
        <img width={40} height={40} src="/icon.png" />
      </Box>
      {search && (
        <>
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="search your personal knowledge base"
            size="small"
            sx={{ flex: 2, mx: 2, color: "white", maxWidth: 400 }}
          />
          <Box
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollIntoView({
                  behavior: "smooth",
                  inline: "nearest",
                  block: "start",
                });
              }
              seachHandler();
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
              width: 100,
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 600, py: 1 }}>
              Search
            </Typography>
          </Box>
        </>
      )}
      <Box>
        <Box sx={{ display: "flex", pt: 1 }}>
          <Typography
            sx={{
              alignSelf: "center",
              fontSize: 20,
              fontWeight: 700,
              maxWidth: 300,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {treeDetails?.name}
          </Typography>

          {/* <Fab sx={{ marginRight: '9px', zIndex: 0, width: '35px', height: '30px', minWidth: '35px', marginLeft: '15px', backgroundColor: '#FFF', alignSelf: 'center' }}>
                <ModeEditOutlineTwoToneIcon onClick={editHandleOpen} />
            </Fab> */}
          {treeadmin ? (
            <>
              <Box
                onClick={editHandleOpen}
                sx={{ alignSelf: "center", p: 1, cursor: "pointer" }}
              >
                <Typography
                  sx={{ textDecoration: "underline", textAlign: "center" }}
                >
                  Edit
                </Typography>
              </Box>
              <Box
                onClick={shareHandleOpen}
                sx={{ alignSelf: "center", p: 1, cursor: "pointer" }}
              >
                <Typography
                  sx={{ textDecoration: "underline", textAlign: "center" }}
                >
                  Share
                </Typography>
              </Box>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        ></Box>
      </Box>
      {!user ? (
        <Box
          sx={{
            ml: "auto",
            color: "#E8CD94",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Box
            onClick={() => {
              router.push("/login");
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
              width: 100,
              p: 1,
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 600 }}>
              Sign in
            </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 0,
              color: "#E8CD94",
              cursor: "pointer",
            }}
          >
            {/* <BackButton onClick={onClick} />{" "} */}
          </Box>

          <Box
            sx={{
              ml: "auto",
              cursor: "pointer",
              px: 3,
            }}
          >
            <Avatar
              onClick={() => {
                signOut();
              }}
              src={user.photo ? user.photo : user.photo_url}
            />
          </Box>
          {/* <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
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
            {user
              ? [
                  <>
                    <MenuItem
                      onClick={() => {
                        // router.push("/user/visits");
                      }}
                    >
                      <Avatar src={user.photo} />
                      {user.firstName} {user.lastName}
                    </MenuItem>
                  </>,
                ]
              : [
                  <>
                    <MenuItem onClick={handleOpenLogin}>
                      <Avatar /> Sign In
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </>,
                ]}
          </Menu> */}
        </>
      )}
    </Box>
  );
}
