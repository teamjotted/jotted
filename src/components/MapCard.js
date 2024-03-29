import { Avatar, Box, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { media } from "../mock/TreePhotos";
import { motion } from "framer-motion";

export default function MapCard({ row, handleClick }) {
  return (
    <motion.div
      whileHover={{
        opacity: 0.8,
        translateY: -2,
      }}
      transition={{
        type: "spring",
        duration: 0.2,
        stiffness: 200,
      }}
    >
      <Box
        onClick={() => handleClick(row.id)}
        sx={{
          display: "flex",
          overflow: "hidden",
          cursor: "pointer",
          flexDirection: "column",
          borderRadius: 2,
          m: 1,
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
          backgroundImage: `url(${
            row.photo == "" ? media[4].photo : row.photo
          }) ,url(${row.photo == "" ? media[4].photo : row.photo})`,
          backgroundRepeat: `no-repeat, no-repeat`,
          backgroundPosition: `center`,
          backgroundSize: "cover",
          height: 250,
          "&:hover": {
            opacity: 0.99,
            boxShadow: "0px 5px 5px rgba(0, 0, 0, .2)",
            // transform: "translateY(-4px)",
          },
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              backgroundColor: "white",
              m: 1,
              height: 24,
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <Typography
              variant="body1"
              sx={{
                mx: 2,
                my: 0.5,
                fontSize: 9,
                fontWeight: 600,
              }}
            >
              {row.price == 0 ? "Free" : "$" + row.price.toFixed(2)}
            </Typography> */}
          </Box>
          {/* <Tooltip
            title={`Created by ${row._user?.firstname} ${row._user?.lastname}`}
          >
            <Avatar
              alt={`${row._user?.firstname}`}
              sx={{
                ml: "auto",
                mr: 1,
                mt: 1,
                fontSize: 14,
              }}
              src={row._user?.photo_url}
            />
          </Tooltip> */}
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
                variant="h1"
                sx={{
                  display: "-webkit-box",
                  // overflow: "hidden",
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
              variant="body1"
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
              {row?.description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
