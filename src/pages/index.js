import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, signOut } from "next-auth/react";
import Header from "@/components/Header";
import {
  Box,
  CssBaseline,
  LinearProgress,
  CircularProgress,
  Skeleton,
  Pagination,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { getPublicTrees } from "@/utils/api";
import MapSection from "@/components/MapSection";
import Layout from "@/components/Layout";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
const inter = Inter({ subsets: ["latin"] });

const categories = ["Free", "Paid", "Education", "Business"];

export default function Home() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [pageState, setPageState] = useState({
    page: 0,
    per_page: 4,
    offset: 0,
    item_total: 0,
    page_total: 0,
    filter: "",
  });

  const [pageStateFree, setPageStateFree] = useState({
    page: 0,
    per_page: 4,
    offset: 0,
    item_total: 0,
    page_total: 0,
    filter: "",
  });

  const [pageStateRecent, setPageStateRecent] = useState({
    page: 0,
    per_page: 4,
    offset: 0,
    item_total: 0,
    page_total: 0,
    filter: "",
  });

  const [trees, setTrees] = useState([]);
  const [freeTrees, setFreeTrees] = useState([]);
  const [recentTrees, setRecentTrees] = useState([]);
  const [paidTrees, setPaidTrees] = useState([]);
  function handleClick(id) {
    console.log(id);
    router.push(`/map/${id}`);
  }
  useEffect(() => {
    setLoading(true);
    // if (!data) {
    //   router.push("/login");
    // }
    getPublicTrees(
      pageState.page,
      pageState.per_page,
      pageState.offset,
      "featured"
    )
      .then((res) => {
        console.log(res);
        setTrees(res.items);
        setPageState((prev) => ({
          ...prev,
          page: res.curPage,
          per_page: 4,
          offset: res.offset,
          item_total: res.itemsTotal,
          page_total: res.pageTotal,
        }));

        getPublicTrees(1, 4, 0, "free")
          .then((res) => {
            console.log(res);
            setFreeTrees(res.items);
            setPageStateFree((prev) => ({
              ...prev,
              page: res.curPage,
              per_page: 4,
              offset: res.offset,
              item_total: res.itemsTotal,
              page_total: res.pageTotal,
            }));
          })
          .catch((e) => {
            // signOut();
            console.log(e);
          });

        getPublicTrees(1, 4, 0, "recent")
          .then((res) => {
            console.log(res);
            setRecentTrees(res.items);
            setPageStateRecent((prev) => ({
              ...prev,
              page: res.curPage,
              per_page: 4,
              offset: res.offset,
              item_total: res.itemsTotal,
              page_total: res.pageTotal,
            }));
            setLoading(false);
          })
          .catch((e) => {
            // signOut();
            console.log(e);
          });
      })
      .catch((e) => {
        // signOut();
        console.log(e);
      });
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          background: "#00000017",
          display: "flex",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          animate={{
            scale: [2, 1, 2, 1, 1],
            rotate: [0, 360, 180, 180, 360],
            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <img width={40} height={40} src="/icon.png" />
        </motion.div>
        {/* <CircularProgress size={50} /> */}
      </Box>
    );
  }
  return (
    <Box
      sx={{ backgroundColor: "#F2F1F6", height: "100%", minHeight: "100vh" }}
    >
      <Head>
        <title>Jotted | Home</title>
        <meta name="description" content="Marketplace for microlearning" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        handleSignIn={() => {
          router.push("/login");
        }}
      />
      <CssBaseline />

      <Box
        sx={{
          flex: 1,
          alignContent: "center",
          display: "flex",
          mx: 3,
        }}
      >
        <Box sx={{ width: 300, mt: 2 }}>
          {/* <Box sx={{ minWidth: 120, ml: "auto" }}>
              <FormControl
                size="small"
                sx={{ backgroundColor: "white", minWidth: 120 }}
              >
                <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={pageState.filter}
                  label="Sort by"
                  onChange={(e) => {
                    setPageState((prev) => ({
                      ...prev,
                      filter: e.target.value,
                    }));
                  }}
                >
                  <MenuItem value={"views"}>$ Low to high</MenuItem>
                  <MenuItem value={"recent"}>$ High to ligh</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
          {/* <Sidebar /> */}
          {/* {categories.map((res) => {
            return (
              <Box sx={{ p: 1, backgroundColor: "white", display: "flex" }}>
                <PublicRoundedIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontSize: 18 }}>{res}</Typography>
              </Box>
            );
          })} */}
        </Box>

        <Box sx={{ display: "flex", width: 1250, mx: 2 }}>
          {/* <Box sx={{ display: "flex" }}>
              {width > 450 ? (
                <Box
                  sx={{
                    maxWidth: width - 20,
                    display: "flex",
                    overflowX: "auto",
                  }}
                >
                  {tags.map((res) => {
                    return (
                      <Box
                        onClick={() => {
                          console.log(res);
                          if (selectedTag == res.name) {
                            setSelectedTag(null);
                          } else {
                            setSelectedTag(res.name);
                          }
                        }}
                        sx={{
                          cursor: "pointer",
                          p: 1,
                          border: 1,

                          borderColor: "#00A4FF",
                          backgroundColor: "white",
                          backgroundImage:
                            res.name === selectedTag
                              ? "linear-gradient(to right bottom, #00A4FF, #7BCCF9)"
                              : null,
                          borderRadius: 2,
                          mr: 2,
                          my: 2,
                          "&:hover": {
                            backgroundImage:
                              "linear-gradient(to right bottom, #00A4FF, #7BCCF9)",
                          },
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            fontSize: width > 450 ? 14 : 12,
                            fontWeight: 600,
                            color: res.name === selectedTag ? "white" : "black",
                          }}
                        >
                          {res.name} {res.emoji}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <></>
              )}
              <Box sx={{ minWidth: 120, ml: "auto" }}>
                <FormControl
                  size="small"
                  sx={{ backgroundColor: "white", minWidth: 120 }}
                >
                  <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={pageState.filter}
                    label="Sort by"
                    onChange={(e) => {
                      setPageState((prev) => ({
                        ...prev,
                        filter: e.target.value,
                      }));
                    }}
                  >
                    <MenuItem value={"views"}>Most Popular</MenuItem>
                    <MenuItem value={"recent"}>Most Recent</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box> */}

          <Box
            sx={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MapSection
              name={"Featured"}
              trees={trees}
              handleClick={handleClick}
              data={"featured"}
            />
            <MapSection
              name={"Top Free"}
              trees={freeTrees}
              handleClick={handleClick}
              data={"free"}
            />
            <MapSection
              name={"Recent"}
              trees={recentTrees}
              handleClick={handleClick}
              data={"recent"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: "/",
//   //       permanent: false,
//   //     },
//   //   };
//   // }
//   return {
//     props: { data: session },
//   };
// }
