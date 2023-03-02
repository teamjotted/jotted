import Header from "@/components/Header";
import {
  Box,
  Avatar,
  Typography,
  Grid,
  CssBaseline,
  Stack,
  Pagination,
  Modal,
} from "@mui/material";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  getMyPurchasedTrees,
  getMySharedTrees,
  getMyTrees,
  getUserById,
  getUserResources,
  stripeConnect,
} from "@/utils/api";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { media } from "../../mock/TreePhotos";
import MapCard from "@/components/MapCard";
import LogoutIcon from "@mui/icons-material/Logout";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import EditProfilePopup from "../Popup/EditProfilePopup";

export default function MyProfile() {
  const scrollRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState();
  const [trees, setTrees] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [shared, setShared] = useState([]);
  const [section, setSection] = useState("maps");
  const { width } = useWindowDimensions();
  const [pageState, setPageState] = useState({
    page: 1,
    per_page: 9,
    offset: 0,
    item_total: 0,
    page_total: 0,
    data: [],
  });
  function stripeHandler() {
    // window.location.replace('google.com');
    stripeConnect(user.id)
      .then((res) => {
        console.log(res);
        window.open(res.data.result_1.response.result.url);
      })
      .catch((e) => {
        toast.error(e.data.message);
      });
  }
  function newMapbtnHandler() {
    router.push("/map/create");
  }
  function handleClick(id) {
    console.log(id);
    router.push(`/map/${id}`);
  }
  function sectionHandler() {}

  useEffect(() => {
    //console.log(data);

    console.log(id);
    getUserById(id).then((res) => {
      console.log(res);
      setUser(res);
    });
    getMyTrees().then((res) => {
      console.log(res.data);
      setTrees(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (section == "purchases") {
      getMyPurchasedTrees().then((res) => {
        console.log(res.data);
        //setTrees(res.data);
        setPurchases(res.data);
      });
    }
    if (section == "maps") {
      getMyTrees().then((res) => {
        console.log(res.data);
        setTrees(res.data);
      });
    }
    if (section == "shared") {
      getMySharedTrees().then((res) => {
        console.log(res);
        if (res) {
          setShared(res.data);
        }
      });
    }
  }, [section]);

  function resourceHandler() {
    setSection("resources");
    getUserResources(
      id,
      pageState.page,
      pageState.per_page,
      pageState.offset
    ).then((res) => {
      console.log(res);
      setPageState({
        page: res.page,
        per_page: 9,
        offset: res.offset,
        item_total: res.itemsTotal,
        page_total: res.pageTotal,
        data: res.items,
      });
    });
  }

  useEffect(() => {
    if (pageState.page) {
      getUserResources(
        id,
        pageState.page,
        pageState.per_page,
        pageState.offset
      ).then((res) => {
        console.log(res);
        setPageState((prev) => ({
          ...prev,
          page: res.page,
          per_page: 9,
          offset: res.offset,
          item_total: res.itemsTotal,
          page_total: res.pageTotal,
          data: res.items,
        }));
      });
    }
  }, [pageState.page]);

  //console.log(user);
  return (
    <>
      <Box
        sx={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
        }}
      >
        <Box sx={{ maxWidth: 1200, mt: 3, width: 1200 }}>
          <Box sx={{ display: "flex", m: 1 }}>
            <Avatar sx={{ width: 100, height: 100 }} src={user?.photo_url} />
            <Box
              sx={{
                ml: 2,
                display: "flex",

                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, maxWidth: 300 }}>
                <Typography
                  sx={{ fontSize: 20, fontWeight: 600, color: "#111827" }}
                >
                  {user?.firstname} {user?.lastname}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    maxWidth: 200,
                    justifyContent: "space-between",
                    color: "#6B7280",
                  }}
                >
                  <Typography noWrap>@{user?.username}</Typography>

                  {width > 450 && (
                    <Typography noWrap>{trees.length} maps</Typography>
                  )}
                </Box>
              </Box>
              <Box sx={{ ml: "auto", display: "flex" }}>
                {width > 450 && (
                  <Box
                    onClick={handleOpen}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "white",
                      height: 40,
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      borderColor: "#D1D5DB",
                      px: 1,
                    }}
                  >
                    <ModeEditRoundedIcon sx={{ mx: 1 }} />
                    <Typography sx={{ fontWeight: 600, color: "black", mx: 1 }}>
                      Edit
                    </Typography>
                  </Box>
                )}
                <Box
                  onClick={() => {
                    signOut();
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.7,
                    },
                    borderRadius: 2,
                    display: "flex",
                    boxShadow: 0,
                    backgroundColor: "white",
                    height: 40,
                    mr: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    border: 1,
                    borderColor: "#D1D5DB",
                    px: 1,
                  }}
                >
                  <LogoutIcon sx={{ mx: 1 }} />
                  <Typography sx={{ fontWeight: 600, color: "black", mx: 1 }}>
                    Logout
                  </Typography>
                </Box>

                {/* {!user?.stripe && (
                  <Box
                    onClick={stripeHandler}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.6,
                      },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "rgb(84,51,255,0.2)",
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      height: 40,
                      border: 1,
                      borderColor: "#D1D5DB",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "white", px: 2 }}>
                      Connect Stripe
                    </Typography>
                  </Box>
                )} */}
              </Box>
            </Box>
          </Box>
          {/* <Box className={classes.mainHeading}>
								<Typography sx={{ m: 1, textAlign: 'center', fontWeight: 600, my: 9, color: '#FFFFFF' }}>a collection of knowledge maps created or saved by you!</Typography>
							</Box> */}
          <Box
            sx={{
              my: 2,
            }}
          >
            <Box
              ref={scrollRef}
              onClick={newMapbtnHandler}
              sx={{
                border: 1,
                width: 300,
                borderColor: "#DADADA",
                p: 2,
                m: 1,
                px: 4,
                borderRadius: 3,
                display: "flex",
                cursor: "pointer",
                backgroundColor: "white",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Box sx={{ color: "#111827" }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
                  new mindmap
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  add new links and resources
                </Typography>
              </Box>
              <AddIcon
                sx={{
                  alignSelf: "center",
                  fontSize: 30,
                  ml: "auto",
                  mr: 0,
                }}
              />
            </Box>
          </Box>
          <Box>
            <Box
              sx={{
                my: 2,
                display: "flex",
                overflowX: "auto",
              }}
            >
              <Box
                onClick={() => setSection("maps")}
                sx={{
                  border: 1,
                  borderColor: "#DADADA",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: section == "maps" ? "#00A4FF" : "white",
                  color: section == "maps" ? "white" : "black",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  My Maps
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setSection("shared");
                }}
                sx={{
                  border: 1,
                  borderColor: "#DADADA",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: section == "shared" ? "#00A4FF" : "white",
                  color: section == "shared" ? "white" : "black",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Shared Map
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setSection("purchases");
                }}
                sx={{
                  border: 1,
                  borderColor: "#DADADA",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: section == "purchases" ? "#00A4FF" : "white",
                  color: section == "purchases" ? "white" : "black",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  Purchased Maps
                </Typography>
              </Box>
              <Box
                onClick={() => {
                  setSection("resources");
                }}
                sx={{
                  border: 1,
                  borderColor: "#DADADA",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: section == "resources" ? "#00A4FF" : "white",
                  color: section == "resources" ? "white" : "black",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  My Resources
                </Typography>
              </Box>
            </Box>
            {section == "maps" && (
              <>
                <Box sx={{ my: 2 }}>
                  <Grid
                    sx={{ overflow: "hidden" }}
                    container
                    spacing={{ xs: 1, md: 1 }}
                    columns={{ xs: 1, sm: 2, md: 4 }}
                  >
                    {trees.map((row, index) => {
                      return (
                        <Grid item xs={1} sm={1} md={1} key={index}>
                          <MapCard row={row} handleClick={handleClick} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </>
            )}
            {section == "shared" && (
              <>
                {shared.length > 0 && (
                  <Box style={{ marginTop: 30 }}>
                    <Box sx={{ mx: 2, my: 2 }}>
                      <Grid
                        sx={{ overflow: "hidden" }}
                        container
                        spacing={{ xs: 1, md: 3 }}
                        columns={{ xs: 2, sm: 3, md: 6 }}
                      >
                        {shared.map((row, index) => {
                          return (
                            <Grid item xs={1} sm={1} md={2} key={index}>
                              <MapCard row={row} handleClick={handleClick} />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </Box>
                )}
              </>
            )}
            {section == "resources" && (
              <Box>
                <Grid
                  sx={{ overflow: "hidden" }}
                  container
                  spacing={{ xs: 1, md: 1 }}
                  columns={{ xs: 1, sm: 1, md: 1 }}
                >
                  {pageState.data.map((res, index) => {
                    return (
                      <Grid item xs={1} sm={1} md={1} key={index}>
                        <Box
                          sx={{
                            flexDirection: "column",
                            p: 1,
                            borderRadius: 2,
                            my: 2,
                            display: "flex",
                            backgroundColor: "#F2F2F2",
                            maxWidth: 900,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              // "&:hover": {
                              //   color: "#00A4FF",
                              // },
                            }}
                          >
                            <Box
                              component={"img"}
                              width={100}
                              height={100}
                              sx={{
                                borderRadius: 2,
                                mr: 1,
                                alignSelf: "center",
                              }}
                              src={res.preview_url}
                            />

                            <Box sx={{ cursor: "pointer", ml: 2 }}>
                              <>
                                <Typography
                                  sx={{
                                    fontWeight: 100,
                                    fontSize: 10,
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
                                  }}
                                >
                                  {res.title}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: 12,
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                  }}
                                >
                                  {res.description}
                                </Typography>
                              </>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Box sx={{ my: 5, justifyContent: "center", display: "flex" }}>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    count={pageState.page_total}
                    page={pageState.page}
                    onChange={(e, value) => {
                      console.log(value);
                      setPageState((prev) => ({ ...prev, page: value }));
                      if (scrollRef.current) {
                        scrollRef.current.scrollIntoView({
                          behavior: "smooth",
                          inline: "nearest",
                          block: "start",
                        });
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
            {section == "purchases" && (
              <>
                <Box sx={{ my: 2 }}>
                  <Grid
                    sx={{ overflow: "hidden" }}
                    container
                    spacing={{ xs: 1, md: 1 }}
                    columns={{ xs: 1, sm: 2, md: 4 }}
                  >
                    {purchases.map((row, index) => {
                      return (
                        <Grid item xs={1} sm={1} md={1} key={index}>
                          <MapCard row={row.tree} handleClick={handleClick} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <EditProfilePopup
          setUser={setUser}
          open={open}
          handleClose={handleClose}
        />
      </Box>
    </>
  );
}
