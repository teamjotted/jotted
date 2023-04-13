"use client";
import { getServerSession } from "next-auth/next";
import { options } from "../pages/api/auth/[...nextauth]";
import MapSection from "@/components/MapSection";
import { Box } from "@mui/material";

const page = async () => {
  const session = await getServerSession(options);

  return (
    <Box
      sx={{ backgroundColor: "#FAFAFA", height: "100%", minHeight: "100vh" }}
    >
      <CssBaseline />
      {/* <Header
        session={session}
        handleSignIn={() => {
          router.push("/login");
        }}
        query={true}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
      /> */}
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
        <Box sx={{ display: "flex", width: 1050, mx: 2, py: 10 }}>
          <Box
            sx={{
              color: "black",
              flex: 1,
              justifyContent: "start",
              alignContent: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <>
              <br />
              <br />
              <br />
              <Box sx={{ display: "flex", my: 5 }}>
                {" "}
                <TextField
                  fullWidth
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search #WebUniversity for jotted a map..."
                  size="small"
                  sx={{
                    flex: 2,
                    mr: 2,
                    borderRadius: 2,
                    backgroundColor: "white",
                    boxShadow: "0px 5px 9px rgba(0, 0, 0, 0.1)",
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
                    boxShadow: 10,
                    backgroundColor: "#151127",
                    cursor: "pointer",

                    justifyContent: "center",
                    alignItems: "center",
                    width: 150,
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 500, py: 1 }}>
                    Search
                  </Typography>
                </Box>
              </Box>
              <Topbar router={router} />
            </>
            <Box sx={{ mt: 10 }}>
              <MapSection
                name={"Today’s featured maps"}
                trees={trees}
                handleClick={handleClick}
                data={"featured"}
              />
              <MapSection
                name={"Most popular maps"}
                trees={freeTrees}
                handleClick={handleClick}
                data={"free"}
              />
              <MapSection
                name={"Latest and greatest"}
                trees={recentTrees}
                handleClick={handleClick}
                data={"recent"}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "200px",
          background: "#151127",
          alignContent: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

export default page;
