/* eslint-disable react/display-name */
import React, { memo, useEffect, useState } from "react";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip,
  Button,
  Divider,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";

import { Handle } from "react-flow-renderer";

import {
  deleteNodeAttachments,
  getNodeAttachments,
  getNodeDetailsById,
  deleteNode,
  editNode,
} from "../../utils/api";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setNodeId } from "@/store/Node/node.action";

export default memo(
  ({ data, isConnectable, id, position, xPos, yPos, ...props }) => {
    const dispatch = useDispatch();
    const { treeAdmin } = useSelector((state) => state.treeData);
    //const treeAdmin = false;
    //onClick={() => window.open(obj.src)

    return (
      <>
        <Handle
          type="target"
          position="top"
          style={{
            zIndex: "999",
            width: treeAdmin ? "2px" : "0px",
            height: treeAdmin ? "2px" : "0px",
            margin: "auto",
            background: "#ddd",
            borderRadius: "15px",
            border: treeAdmin ? "2px solid #ddd" : "",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
          }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={isConnectable}
        />

        <Box
          onClick={() => {
            dispatch(setNodeId(id));
          }}
          sx={{
            backgroundImage: `url('${data.photo}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            width: 200 / 2.5,
            height: 200 / 2.5,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: "white",
                textAlign: "center",
                p: 1,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 4,
                opacity: 0,
                transition: "opacity 0.2s ease",
                ":hover": {
                     opacity: 1
                    }
              }}
            >
              {data.label}
            </Typography>

          </Box>
        </Box>

        <Handle
          type="source"
          position="bottom"
          id="a"
          style={{
            zIndex: "999",
            width: treeAdmin ? "2px" : "0px",
            height: treeAdmin ? "2px" : "0px",
            margin: "auto",
            background: "#ddd",
            borderRadius: "15px",
            border: treeAdmin ? "2px solid #ddd" : "",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
          }}
          isConnectable={isConnectable}
        />
      </>
    );
  }
);
