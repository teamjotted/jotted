import { Box, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
export default function Sidebar() {
  return (
    <>
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          backgroundColor: "white",
          border: 1,
          display: "flex",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "white",
          },
        }}
      >
        <HomeRoundedIcon sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 18 }}>Home</Typography>
      </Box>
      <Box sx={{ p: 1, backgroundColor: "white", display: "flex" }}>
        <PublicRoundedIcon sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 18 }}>Free</Typography>
      </Box>
      <Box sx={{ p: 1, backgroundColor: "white", display: "flex" }}>
        <SellRoundedIcon sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 18 }}>Paid</Typography>
      </Box>
      <Box sx={{ p: 1, backgroundColor: "white", display: "flex" }}>
        <SchoolRoundedIcon sx={{ mr: 1 }} />
        <Typography sx={{ fontSize: 18 }}>Education</Typography>
      </Box>
    </>
  );
}
