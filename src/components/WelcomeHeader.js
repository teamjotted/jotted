export default function WelomceHeader() {
  return (
    <Box sx={{ display: "flex" }}>
      {width > 700 && (
        <Box sx={{ flex: 1, mr: width > 600 ? 7 : 0 }}>
          <Typography
            variant="h2"
            sx={{ fontSize: "60px", fontWeight: 600, font: "Inter" }}
          >
            Turning content
            <Typography
              display="inline"
              sx={{
                fontSize: "60px",
                fontWeight: 600,
                font: "inter",
                color: "black",
              }}
            >
              <br /> into courses
            </Typography>
          </Typography>
          {/* <Typography
              // variant="h2"
              sx={{ fontSize:"72px", fontWeight: 600, font: "inter", color: "black" }}
            >
              into courses
            
            </Typography> */}
          <Typography sx={{ fontSize: "14px", my: 1, font: "inter" }}>
            <br />
            Join over a thousand learners{" "}
            <b>turning the internet into an accessible online university</b> by
            mapping the best resources on the web into learning pathways!
          </Typography>
          <Box
            onClick={() => {
              router.push(`/recent`);
            }}
            sx={{
              "&:hover": { opacity: 0.7 },
              borderRadius: 2,
              display: "flex",
              boxShadow: 10,
              backgroundColor: "#151127",
              cursor: "pointer",
              mr: 1,
              justifyContent: "center",
              alignItems: "center",
              width: 150,
              mt: 5,
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 500, py: 1 }}>
              Explore
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ flex: 1, ml: width > 700 ? 7 : 0, maxWidth: 400 }}>
        {paidTrees.length > 0 ? (
          <Carousel autoPlay infiniteLoop swipeable interval={10000}>
            {paidTrees.map((res) => {
              return (
                <>
                  <Box
                    onClick={() => {
                      router.push(`/map/${res.id}`);
                    }}
                    sx={{
                      //her eis the change
                      "&:hover": {
                        translateY: -2,
                        opacity: 0.9,
                      },
                      cursor: "pointer",
                      minHeight: 300,

                      backgroundImage: `url('${res?.photo}')`,
                      backgroundPosition: "center",
                      backgroundSize: "fill",
                      display: "flex",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                    src={res.photo}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        mt: "auto",
                        width: "100%",
                        height: 200,
                        background:
                          "linear-gradient(to bottom,rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))",
                      }}
                    >
                      <Box sx={{ mt: "auto", p: 1 }}>
                        <Typography sx={{ color: "white", fontSize: 12 }}>
                          {res.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: 500,
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {res.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </>
              );
            })}
          </Carousel>
        ) : (
          <Skeleton variant="rounded" width={"100%"} height={300} />
        )}
      </Box>
    </Box>
  );
}
