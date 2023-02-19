import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { Box } from "@mui/material";

export default function IFrameComponent({ frame, resource }) {
  const { width, height } = useWindowDimensions();
  return (
    <object
      style={{
        overflow: "hidden",
        borderRadius: 10,
        display: "flex",
        // marginLeft: "auto",
        // marginRight: "auto",
        backgroundColor: "#F2F1F6",
        overflowY: "scroll",
      }}
      id="receiver"
      data={frame}
      width="100%"
      height={600}
    >
      <Box
        sx={{
          width: width >= 450 ? width - 500 : width,
          backgroundColor: "white",
        }}
      >
        <Box
          onClick={() => {
            console.log("Reloading");
            window.open(resource.src);
            //document.getElementById('reciever').data += '';
          }}
          sx={{
            // backgroundImage: `url('${selectedNode?.photo}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            position: "relative",
            height: "100%",
            backgroundColor: "white",
            borderRadius: 2,
            overflowX: "hidden",
            overflowY: "auto",
            "&:hover": {
              opacity: 0.8,
              cursor: "pointer",
            },
          }}
        >
          <Box>
            <img
              style={{
                width: width >= 450 ? width - 500 : width,
                marginLeft: "auto",
                marginRight: "auto",
                objectFit: "fill",
              }}
              src={resource?.preview_url}
            />
          </Box>
        </Box>
      </Box>
      <embed
        id="reciever"
        src={frame}
        width={width >= 450 ? width - 500 : width}
        height={height - 200}
      />
    </object>
  );
}
