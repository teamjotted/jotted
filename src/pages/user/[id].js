//created by talbert herndon

import Header from "@/components/Header";
import {
  Box,
  Avatar,
  Typography,
  Grid,
  CssBaseline,
  Stack,
  Pagination,
} from "@mui/material";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  getMyPurchasedTrees,
  getMyTrees,
  getUserById,
  getUserResources,
  getTreesByUserId,
} from "@/utils/api";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import { media } from "../../mock/TreePhotos";
import MapCard from "@/components/MapCard";
import MyProfile from "@/components/Profile/UserProfile";
import CheckIcon from "@mui/icons-material/Check";

export default function User() {
  const { data } = useSession();

  const scrollRef = useRef(null);

  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState();
  const [trees, setTrees] = useState([]);
  const [resources, setResource] = useState([]);
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
  useEffect(() => {
    if (id) {
      console.log(id);
      getUserById(id).then((res) => {
        console.log(res);
        setUser(res);
      });
      getTreesByUserId(id).then((res) => {
        console.log(res);
        setTrees(res.tree);
        setResource(res.resources);
      });
      // getMyTrees().then((res) => {
      //   console.log(res.data);
      //   setTrees(res.data);
      // });
    }
  }, [id, data]);

  function handleClick(id) {
    console.log(id);
    router.push(`/map/${id}`);
  }
  return (
    <Box
      sx={{ backgroundColor: "#F2F1F6", height: "100%", minHeight: "100vh" }}
    >
      <Head>
        <title>Profile</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header
        session={data}
        handleSignIn={() => {
          router.push("/login");
        }}
      />
      <CssBaseline />
      {data?.user.id == id ? (
        <MyProfile user={data} />
      ) : (
        <Box
          sx={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
          }}
        >
          <Box sx={{ maxWidth: 1000, mt: 3, width: 1000 }}>
            <Box sx={{ display: "flex", m: 1 }}>
              <Avatar
                alt={`${user?.firstname}`}
                sx={{ width: 100, height: 100 }}
                src={
                  user?.photo_url ||
                  `https://avatars.dicebear.com/api/micah/${user?.email}.svg`
                }
              />
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
                      maxWidth: 600,
                      justifyContent: "space-between",
                      color: "#6B7280",
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      @{user?.username}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      {resources} Resources Mapped
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>
                      {trees.length} Maps
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: "auto", display: "flex" }}>
                  {/* <Box
                    onClick={() => {
                      toast.success("Not live");
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                      borderRadius: 2,
                      display: "flex",
                      boxShadow: 0,
                      backgroundColor: "#151127",
                      height: 40,
                      mr: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      border: 1,
                      borderColor: "#D1D5DB",
                    }}
                  >
                    <CheckIcon sx={{ ml: 1, color: "white" }} />
                    <Typography sx={{ fontWeight: 500, color: "white", px: 2 }}>
                      follow
                    </Typography>
                  </Box> */}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                my: 2,
                display: "flex",
              }}
            >
              <Box
                // onClick={() => setSection("maps")}
                sx={{
                  border: 1,
                  borderColor: "#DADADA",
                  p: 1,
                  m: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: section == "maps" ? "#151127" : "white",
                  color: section == "maps" ? "white" : "black",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  User Maps
                </Typography>
              </Box>
            </Box>
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
          </Box>
        </Box>
      )}
    </Box>
  );
}
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
