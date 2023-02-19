import { Avatar, Box, Stack, Tooltip, Typography } from "@mui/material";
import { media } from "../mock/TreePhotos";

export default function MapCard({ row, handleClick }) {
  return (
    <Box
      onClick={() => handleClick(row.id)}
      sx={{
        display: "flex",
        overflow: "hidden",
        cursor: "pointer",
        flexDirection: "column",
        borderRadius: 2,
        mx: 1,
        backgroundImage: `url(${
          row.photo == "" ? media[4].photo : row.photo
        }) ,url(${row.photo == "" ? media[4].photo : row.photo})`,
        backgroundRepeat: `no-repeat, no-repeat`,
        backgroundPosition: `center`,
        height: 250,
        "&:hover": {
          opacity: 0.9,
        },
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            backgroundColor: "white",
            m: 1,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              mx: 1,
              fontSize: 12,
            }}
          >
            {row.price == 0 ? "Free" : row.price}
          </Typography>
        </Box>
        <Tooltip
          title={`Created by ${row._user?.firstname} ${row._user?.lastname}`}
        >
          <Avatar
            sx={{
              ml: "auto",
              mr: 1,
              mt: 1,
              fontSize: 14,
            }}
            src={row._user?.photo_url}
          />
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          mt: "auto",
          backgroundImage:
            "linear-gradient(to top, rgba(0, 0, 0, 0.9)20%, rgba(0, 0, 0, 0)100%)",
          height: 125,
          p: 0.5,
        }}
      >
        <Box sx={{ mt: "auto", p: 1 }}>
          <Stack
            direction={"row"}
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
              mt: "auto",
            }}
          >
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                fontWeight: 600,
                fontSize: 14,
                width: "80%",
                color: "white",
              }}
            >
              {row?.name}
            </Typography>
          </Stack>
          <Typography
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              fontWeight: 400,
              fontSize: 12,
              color: "white",
            }}
          >
            {row?.description.toLowerCase()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}