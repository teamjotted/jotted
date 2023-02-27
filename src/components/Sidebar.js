import { Box, Divider, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StarsIcon from "@mui/icons-material/Stars";
import PaymentsIcon from "@mui/icons-material/Payments";
export default function Sidebar({ router }) {
  const [cur, setCur] = useState();
  //const router = useRouter();
  const { catalog } = router.query;
  const pages = ["home", "featured", "free", "paid"];

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
    <>
      <Box
        onClick={() => {
          if (catalog != "") {
            router.push("/");
          }
        }}
        sx={{
          p: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == null ? "white" : "",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
        }}
      >
        <HomeRoundedIcon
          sx={{
            mr: 2,
            fontSize: 20,
            color: catalog == null ? "black" : "#7B7B7B",
          }}
        />
        <Typography
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
          p: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "featured" ? "white" : "",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
        }}
      >
        <StarsIcon
          sx={{
            mr: 2,
            fontSize: 20,
            color: catalog == "featured" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
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
          p: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "free" ? "white" : "",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
        }}
      >
        <SellRoundedIcon
          sx={{
            mr: 2,
            fontSize: 20,
            color: catalog == "free" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          sx={{ fontSize: 18, color: catalog == "free" ? "black" : "#7B7B7B" }}
        >
          Free
        </Typography>
      </Box>
      <Box
        onClick={() => {
          // if (catalog != "paid") {
          //   router.push("/paid");
          // }
        }}
        sx={{
          opacity: 0.3,
          p: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "paid" ? "white" : "",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
        }}
      >
        <PaymentsIcon
          sx={{
            mr: 2,
            fontSize: 20,
            color: catalog == "paid" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          sx={{ fontSize: 18, color: catalog == "paid" ? "black" : "#7B7B7B" }}
        >
          Paid
        </Typography>
      </Box>
      <Box
        onClick={() => {
          if (catalog != "recent") {
            router.push("/recent");
          }
        }}
        sx={{
          p: 1,
          my: 1,
          borderRadius: 1,
          backgroundColor: catalog == "recent" ? "white" : "",
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
          alignItems: "center",
        }}
      >
        <PaymentsIcon
          sx={{
            mr: 2,
            fontSize: 20,
            color: catalog == "recent" ? "black" : "#7B7B7B",
          }}
        />
        <Typography
          sx={{
            fontSize: 18,
            color: catalog == "recent" ? "black" : "#7B7B7B",
          }}
        >
          Recent
        </Typography>
      </Box>
      <Divider sx={{ my: 5 }} />
    </>
  );
}
