import { Box, Typography } from "@mui/material";
import React from "react";
import { media } from "../mock/NodePhotos";
export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ px: 2 }}>
        <Box
          onDragStart={(event) => onDragStart(event, "selectorNode")}
          draggable
          sx={{
            cursor: "pointer",
            boxShadow: "0px 5px 40px -2px rgba(0,0,0,0.15)",
            borderRadius: 2,
            overflow: "hidden",
            width: 200 / 3,
            height: 200 / 3,
          }}
        >
          <Box sx={{ height: 150 / 3, overflow: "hidden" }}>
            <div animate={{ y: 0, scale: 1 }} whileHover={{ scale: 1.1 }}>
              <img
                style={{
                  display: "block",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  objectFit: "fill",
                }}
                src={media[2].photo}
              />
            </div>
          </Box>
          <Box
            sx={{
              height: 50 / 2,
              maxWidth: 300 / 2.5,
              backgroundColor: "white",
              p: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 7,
                fontWeight: 600,
                color: "black",
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            ></Typography>
          </Box>
        </Box>
        <Typography
          sx={{ fontSize: 12, fontWeight: 600, textAlign: "center", mt: 1 }}
        >
          New Node
        </Typography>
      </Box>
      {/* <Box x sx={{ px: 2 }}>
        <Box
          onDragStart={(event) => onDragStart(event, "titleNode")}
          draggable
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Box
            sx={{
              cursor: "pointer",
              borderRadius: 1,
              overflow: "hidden",
              width: 75,
              height: 35,
              backgroundColor: "white",
              p: 0.3,
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                color: "black",
                textAlign: "center",
                justifyContent: "center",
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              title Node
            </Typography>
          </Box>
        </Box>
        <Typography>Title Node</Typography>
      </Box> */}
    </Box>
  );
};
