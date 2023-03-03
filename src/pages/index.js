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
  TextField,
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
import Sidebar from "@/components/Topbar";
import Link from "next/link";
import Carousel from "react-material-ui-carousel";
import Topbar from "@/components/Topbar";
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
  const [search, setSearch] = useState("");
  function handleClick(id) {
    console.log(id);
    router.push(`/map/${id}`);
  }

  function searchHandler() {
    console.log(search);
    if (search != "") {
      getSearchTrees(
        pageState.page,
        pageState.per_page,
        pageState.offset,
        search
      )
        .then((res) => {
          console.log(res);

          setPageState((prev) => ({
            page: 1,
            per_page: width > 450 ? 9 : 8,
            offset: res.offset,
            item_total: res.itemsTotal,
            page_total: res.pageTotal,
          }));
          setTreeAllData(res.items);
        })
        .catch((e) => {
          console.log("selected Tag");
          // logoutBtnHandler();
        });
    } else {
      getPublicTrees(
        pageState.page,
        pageState.per_page,
        pageState.offset,
        pageState.filter
      )
        .then((res) => {
          setTreeAllData(res.items);
        })
        .catch((e) => {
          console.log("logout");
          logoutBtnHandler();
        });
    }
  }

  useEffect(() => {
    setLoading(true);
    // if (!data) {
    //   router.push("/login");
    // }
    router.prefetch("/map");

    getPublicTrees(
      pageState.page,
      pageState.per_page,
      pageState.offset,
      "featured"
    )
      .then((res) => {
        console.log(res);
        setTrees(res.items);
        setPaidTrees(res.items);

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
      sx={{ backgroundColor: "#F1F1F1", height: "100%", minHeight: "100vh" }}
    >
      <Head>
        <title>Jotted</title>
        <meta name="description" content="Marketplace for microlearning" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        handleSignIn={() => {
          router.push("/login");
        }}
        query={true}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
      />
      <CssBaseline />

      <Box
        sx={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
          mx: 3,
          mt: 4,
        }}
      >
        <Box>
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
        </Box>

        <Box sx={{ display: "flex", width: 1200, mx: 2, py: 1 }}>
          <Box
            sx={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {paidTrees.length > 0 ? (
              <Carousel autoPlay infiniteLoop swipeable interval={10000}>
                {paidTrees.map((res) => {
                  return (
                    <>
                      <Box
                        onClick={() => {
                          router.push(`/map/${res.id}`);
                        }}
                        sx={{
                          "&:hover": {
                            opacity: 0.99,
                          },
                          cursor: "pointer",
                          minHeight: 300,
                          backgroundImage: `url('${res?.photo}')`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          display: "flex",
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                        src={res.photo}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            mt: "auto",
                            width: "100%",
                            height: 200,
                            background:
                              "linear-gradient(to bottom,rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))",
                          }}
                        >
                          <Box sx={{ mt: "auto", p: 1 }}>
                            <Typography sx={{ color: "white", fontSize: 12 }}>
                              {res.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "white",
                                fontSize: 16,
                                fontWeight: 700,
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                              }}
                            >
                              {res.name}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  );
                })}
              </Carousel>
            ) : (
              <Skeleton variant="rounded" width={"100%"} height={300} />
            )}
            <>
              <Box sx={{ display: "flex", my: 2 }}>
                {" "}
                <TextField
                  fullWidth
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search for a map"
                  size="small"
                  sx={{
                    flex: 2,
                    mx: 2,
                    borderRadius: 1,
                    backgroundColor: "white",
                    boxShadow: "0px -5px 9px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Box
                  onClick={() => {
                    router.push(`/search/${search}`);
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
              </Box>
              <Topbar router={router} />
            </>
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
