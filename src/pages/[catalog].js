//created by talbert herndon

import Header from "@/components/Header";
import MapCard from "@/components/MapCard";
import Sidebar from "@/components/Topbar";
import ShortCardSkeleton from "@/components/Skeletons/ShortCardSkeleton";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { getPublicTrees, getSearchTrees } from "@/utils/api";
import {
  Typography,
  Box,
  Grid,
  Tooltip,
  Avatar,
  Stack,
  Pagination,
  CssBaseline,
} from "@mui/material";
import { Inter } from "@next/font/google";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { media } from "../mock/TreePhotos";
import Topbar from "@/components/Topbar";
const inter = Inter({ subsets: ["latin"] });

export default function Search({ data }) {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { catalog } = router.query;
  const [pageState, setPageState] = useState({
    page: 1,
    per_page: 16,
    offset: 0,
    item_total: 0,
    page_total: 0,
    filter: "",
  });
  function handleClick(id) {
    console.log(id);
    router.push(`/map/${id}`);
  }
  // useEffect(() => {
  //   setLoading(true);
  //   console.log(catalog);
  //   getPublicTrees(
  //     pageState.page,
  //     pageState.per_page,
  //     pageState.offset,
  //     catalog
  //   )
  //     .then((res) => {
  //       setLoading(false);
  //       console.log(res);
  //       setTrees(res.items);
  //       setPageState((prev) => ({
  //         ...prev,
  //         page: res.curPage,
  //         per_page: 16,
  //         offset: res.offset,
  //         item_total: res.itemsTotal,
  //         page_total: res.pageTotal,
  //       }));
  //     })
  //     .catch((e) => {
  //       // signOut();
  //       console.log(e);
  //     });
  // }, [catalog]);

  useEffect(() => {
    setLoading(true);
    console.log([catalog]);
    getPublicTrees(pageState.page, pageState.per_page, pageState.offset, [
      catalog,
    ]).then((res) => {
      setLoading(false);
      console.log(res);
      setPageState((prev) => ({
        ...prev,
        page: pageState.page,
        offset: res.offset,
        item_total: res.itemsTotal,
        page_total: res.pageTotal,
      }));
      setTrees(res.items);
    });
  }, [pageState.page, pageState.filter, catalog]);
  return (
    <Box
      ref={scrollRef}
      sx={{ backgroundColor: "#F1F1F1", height: "100%", minHeight: "100vh" }}
    >
      <Head>
        <title>
          Jotted |{" "}
          {catalog.charAt(0).toUpperCase() + catalog.slice(1).toLowerCase()}
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header handleSignIn={()=>{
        router.push("/login")
      }} user={data} session={data} />
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
        {" "}
        <>
          <Box
            sx={{
              display: "flex",
              width: 1000,
              mx: 2,
              py: 1,
            }}
          >
            <Box sx={{ maxWidth: 1000 }}>
              <Topbar router={router} />

              <Box sx={{ my: 1 }}>
                <Typography
                  sx={{ fontSize: 30, fontWeight: 700, fontFamily: inter }}
                >
                  {catalog.charAt(0).toUpperCase() +
                    catalog.slice(1).toLowerCase()}
                </Typography>
              </Box>
              {!loading ? (
                <>
                  <Grid
                    sx={{
                      overflow: "hidden",
                    }}
                    container
                    spacing={{ xs: 1, sm: 1, md: 1 }}
                    columns={{ xs: width > 450 ? 2 : 1, sm: 2, md: 4 }}
                  >
                    {trees.map((row, index) => {
                      return (
                        <Grid item xs={1} sm={1} md={1} key={index}>
                          <MapCard row={row} handleClick={handleClick} />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Box
                    sx={{
                      ml: "auto",
                      display: "flex",
                      justifyContent: "flex-end",
                      p: 1,
                    }}
                  ></Box>
                </>
              ) : (
                <Box sx={{ width: 1000 }}>
                  <ShortCardSkeleton />
                  <ShortCardSkeleton />
                  <ShortCardSkeleton />
                  <ShortCardSkeleton />
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 2,
                }}
              >
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
          </Box>
        </>
      </Box>
    </Box>
  );
}
export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: { data: session },
  };
}
