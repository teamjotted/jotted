import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { Avatar, Box, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { Inter, Poppin } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MapCard from "./MapCard";
import ShortCardSkeleton from "./Skeletons/ShortCardSkeleton";

const inter = Inter({ subsets: ["latin"] });

export default function MapSection({ trees, handleClick, name, data }) {
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const router = useRouter();
  useEffect(() => {
    console.log(trees);
    if (trees) {
      setLoading(false);
    }
  }, [trees]);

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Box sx={{ m: 1 }}>
        <Typography sx={{ fontSize: 50, fontWeight: 700, font: "inter" }}>
          {name}
        </Typography>
      </Box>
      {loading ? (
        <Box>
          <ShortCardSkeleton />
        </Box>
      ) : (
        <>
          <Grid
            sx={{}}
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
          >
            <Box
              onClick={() => {
                router.push(`/${data.toLowerCase()}`);
              }}
              sx={{
                border: 1,
                cursor: "pointer",
                p: 1,
                borderRadius: 2,
                backgroundColor: "white",
                borderColor: "#D0D5DD",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ color: "#1D2939" }}>
                See more
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
