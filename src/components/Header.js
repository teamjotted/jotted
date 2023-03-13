import React, { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Fab,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";

export default function Header({
  treeadmin,
  handleSignIn,
  treeDetails,
  editHandleOpen,
  shareHandleOpen,
  isFavourite,
  removeFavourite,
  markFavourite,
  search,
  setSearch,
  query,
  searchHandler,
  session
}) {
  const { width } = useWindowDimensions();
  // const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [toggleE, setToggleE] = useState(false);
  const router = useRouter();
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event) => {
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
      zIndex={99999}
      sx={{
        height: "auto",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        background: "white",
        padding: "5px",
        boxShadow: "0px -5px 20px rgba(0, 0, 0, 0.25)",
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
      {query && (
        <>
          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="search for a map"
            size="small"
            sx={{ flex: 1, mx: 2, color: "white", maxWidth: 400, mt: 0.5 }}
          />
          <Box
            onClick={() => {
              router.push(`/search/${search}`);
            }}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              backgroundColor: "#151127",
              cursor: "pointer",
              ml: 1,
              justifyContent: "center",
              alignItems: "center",
              width: 100,
              height: 40,
              mt: 0.5,
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 600 }}>
              Search
            </Typography>
          </Box>
        </>
      )}
      <Box sx={{ justifyContent: "center", flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            pt: 1,
            justifyContent: "center",
          }}
        >
          {width > 600 ? (
            <>
              {treeadmin && (
                <Chip
                  color="error"
                  size="small"
                  sx={{
                    alignSelf: "center",
                    mx: 0.5,
                    backgroundColor: "#FFE0E0", // Set the background color to E0F6FF
                    borderRadius: "5px", // Set the radius to 20px
                    color: "#FF1C1C", // Set the text color to white
                  }}
                  ariant="filled"
                  textColor="red"
                  label="Admin"
                />
              )}
              {treeDetails?.isPublic && (
                <Chip
                  color="success"
                  size="small"
                  sx={{
                    alignSelf: "center",
                    mx: 0.5,
                    backgroundColor: "#E0F6FF", // Set the background color to E0F6FF
                    borderRadius: "5px", // Set the radius to 20px
                    color: "#0099FF", // Set the text color to white
                  }}
                  label="Public"
                  variant="filled"
                />
              )}
              {treeDetails?.price == 0 ? (
                <Chip
                  color="info"
                  size="small"
                  sx={{
                    alignSelf: "center",
                    mx: 0.5,
                    backgroundColor: "#F4ECFF", // Set the background color to E0F6FF
                    borderRadius: "5px", // Set the radius to 20px
                    color: "#9747FF", // Set the text color to white
                  }}
                  label="Free"
                  variant="filled"
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <Typography
            variant="h1"
            sx={{
              fontSize: 20,
              fontWeight: 700,
              maxWidth: 500,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {treeDetails?.name}
          </Typography>
          {treeadmin ? (
            <KeyboardArrowDownIcon
              onClick={handleOpen}
              sx={{
                display: "flex",
                alignSelf: "center",
                cursor: "pointer",
                ml: 1,
              }}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
      {!session?.user ? (
        <Box
          sx={{
            ml: "auto",
            color: "#E8CD94",
            cursor: "pointer",
            display: "flex",
          }}
        >
          <Box
            onClick={handleSignIn}
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
          {width > 450 && (
            <Box
              onClick={() => {
                router.push("/map/create");
              }}
              sx={{
                "&:hover": { opacity: 0.7 },
                borderRadius: 2,
                display: "flex",
                backgroundColor: "white",
                cursor: "pointer",
                mr: 1,
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
                New Map
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              ml: "auto",
              cursor: "pointer",
              px: 3,
            }}
          >
            <Tooltip
              title={`${session?.user.firstname} ${session?.user.lastname}`}
            >
              <Avatar
                onClick={() => router.push(`/user/${session?.user.id}`)}
                src={session.user.photo_url}
              />
            </Tooltip>
          </Box>
          <Menu
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
            <>
              <MenuItem onClick={shareHandleOpen}>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Share/Publish
                </Typography>
              </MenuItem>
              <MenuItem onClick={editHandleOpen}>
                <Typography variant="body1" sx={{ textAlign: "center" }}>
                  Edit
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <Typography variant="body1">Close</Typography>
              </MenuItem>
            </>
          </Menu>
        </>
      )}
    </Box>
  );
}
