import { Box, Divider, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StarsIcon from "@mui/icons-material/Stars";
import PaymentsIcon from "@mui/icons-material/Payments";

import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function Topbar({ router }) {
  const [cur, setCur] = useState();
  //const router = useRouter();
  const { catalog } = router.query;
  const pages = ["home", "featured", "free", "recent", "media", "seo", "affiliate"];

  useEffect(() => {
    console.log(catalog);
    if (catalog) {
      setCur(catalog);
      console.log(catalog);
    } else {
      setCur("home");
    }
  }, []);
  return (
    <Box sx={{ display: "flex", justifyContent: "left" }}>
      <Box
        onClick={() => {
          if (catalog != "") {
            router.push("/");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 2,
          backgroundColor: catalog == null ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HomeRoundedIcon
          sx={{
            fontSize: 20,
            my: 1,
            color: catalog == null ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{ fontSize: 18, color: catalog == null ? "black" : "#7B7B7B" }}
        >
          Home
        </Typography>
      </Box>
      <Box
        onClick={() => {
          if (catalog != "featured") {
            router.push("featured");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "featured" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StarsIcon
          sx={{
            fontSize: 20,
            my: 1,
            color: catalog == "featured" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            color: catalog == "featured" ? "black" : "#7B7B7B",
          }}
        >
          Featured
        </Typography>
      </Box>
      <Box
        onClick={() => {
          if (catalog != "free") {
            router.push("/free");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "free" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SellRoundedIcon
          sx={{
            my: 1,
            fontSize: 20,
            color: catalog == "free" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{ fontSize: 18, color: catalog == "free" ? "black" : "#7B7B7B" }}
        >
          Free
        </Typography>
      </Box>
      <Box
        onClick={() => {
          if (catalog != "recent") {
            router.push("/recent");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "recent" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LocalFireDepartmentIcon
          sx={{
            my: 1,
            fontSize: 20,
            color: catalog == "recent" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            color: catalog == "recent" ? "black" : "#7B7B7B",
          }}
        >
          Recent
        </Typography>
      </Box>      
      <Box
        onClick={() => {
          if (catalog != "media") {
            router.push("/media");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "media" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LocalFireDepartmentIcon
          sx={{
            my: 1,
            fontSize: 20,
            color: catalog == "media" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            color: catalog == "media" ? "black" : "#7B7B7B",
          }}
        >
          Media
        </Typography>
      </Box>      
      <Box
        onClick={() => {
          if (catalog != "seo") {
            router.push("/seo");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "seo" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LocalFireDepartmentIcon
          sx={{
            my: 1,
            fontSize: 20,
            color: catalog == "seo" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            color: catalog == "seo" ? "black" : "#7B7B7B",
          }}
        >
          SEO
        </Typography>
      </Box>      
      <Box
        onClick={() => {
          if (catalog != "affiliate") {
            router.push("/affiliate");
          }
        }}
        sx={{
          p: 3,
          py: 1.5,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "affiliate" ? "white" : "",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LocalFireDepartmentIcon
          sx={{
            my: 1,
            fontSize: 20,
            color: catalog == "affiliate" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: 18,
            color: catalog == "affiliate" ? "black" : "#7B7B7B",
          }}
        >
          Affiliate
        </Typography>
      </Box>    
    </Box>
  );
}
