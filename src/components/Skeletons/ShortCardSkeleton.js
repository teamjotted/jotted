import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { Grid, Skeleton } from "@mui/material";

export default function ShortCardSkeleton() {
  const { width } = useWindowDimensions();
  return (
    <Grid
      sx={{
        overflow: "hidden",
        my: 1,
      }}
      container
      spacing={{ xs: 1, sm: 1, md: 1 }}
      columns={{ xs: width > 450 ? 2 : 1, sm: 2, md: 4 }}
    >
      <Grid item xs={1} sm={1} md={1}>
        {" "}
        <Skeleton variant="rounded" width="100%" height={250} />
      </Grid>
      <Grid item xs={1} sm={1} md={1}>
        {" "}
        <Skeleton variant="rounded" width="100%" height={250} />
      </Grid>
      <Grid item xs={1} sm={1} md={1}>
        {" "}
        <Skeleton variant="rounded" width="100%" height={250} />
      </Grid>
      <Grid item xs={1} sm={1} md={1}>
        {" "}
        <Skeleton variant="rounded" width="100%" height={250} />
      </Grid>
    </Grid>
  );
}
