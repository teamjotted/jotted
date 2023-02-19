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
import { useDispatch, useSelector } from "react-redux";
import { setNodeId } from "@/store/Node/node.action";

export default memo(
  ({ data, isConnectable, id, position, xPos, yPos, ...props }) => {
    const dispatch = useDispatch();
    const [attachments, setAttachments] = useState([]);
    const [nodeName, setNodeName] = useState(data.label);
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const [url, setUrl] = useState("");
    const [resourcePopup, setResourcePopup] = useState(false);
    const [node, setNode] = useState([]);
    const [resourceId, setResourceId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editNodeMode, setEditNodeMode] = useState(false);
    const [treeid, setTreeId] = useState();
    const [treeAdmin, setTreeAdmin] = useState(false);
    const open = Boolean(anchorEl);
    //const { treeAdmin } = useSelector((state) => state.treeData);

    const saveEditNode = () => {
      console.log(position);
      const editedNode = {
        naufeltree_id: id,
        label: nodeName,
        tree_id: treeid,
        position: {
          x: xPos,
          y: yPos,
        },
      };
      console.log(editedNode);
      editNode(id, editedNode, treeid, dispatch).then((res) => {
        console.log(res);
      });
    };
    const classes = {
      addResourseIcon: {
        position: "absolute",
        right: "4px",
        top: "4px",
        height: "17px",
        cursor: "pointer",
        "& svg": {
          fontSize: "22px",
        },
      },
      addResourseBox: {
        top: "69%",
        right: "3%",
        width: "100%",
        position: "absolute",
      },
      addResourseButton: {
        background: "#E8CD94",
        cursor: "pointer",
        padding: "10px 20px",
        margin: "10px 0px",
        borderRadius: "12px",
        fontWeight: "700",
        color: "#fff",
        border: "none",
      },
      saveBtn: {
        "&.MuiButton-root": {
          background: " #E8CD94",
          borderRadius: "8px",
          width: "180px",
          height: "35px",
          fontWeight: "600",
          fontSize: "15px",
          lineHeight: "22px",
          color: "#FFFFFF",
        },
        "&:hover": {
          background: "#FFFFFF !important",
          color: "#E8CD94",
        },
      },
    };

    useEffect(() => {
      // console.log(data);
      if (id) {
        getNodeDetailsById(id).then((res) => {
          getNodeAttachments(id).then((res) => {
            setAttachments(res.data);
          });
          setNode(res.data);

          setTreeId(res.data.tree_id);
        });
      }
    }, [data, editing, resourcePopup]);

    //onClick={() => window.open(obj.src)
    return (
      <>
        <Handle
          type="target"
          position="top"
          style={{
            zIndex: "999",
            width: treeAdmin ? "5px" : "0px",
            height: treeAdmin ? "5px" : "0px",
            margin: "auto",
            background: "#ddd",
            borderRadius: "15px",
            border: treeAdmin ? "2px solid #ddd" : "",
          }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={treeAdmin ? isConnectable : isConnectable}
        />
        <Box
          onClick={() => {
            dispatch(setNodeId(id));
            console.log("CLICKED", id);
          }}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            width: 200 / 2.5,
            height: 200 / 2.5,
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
                src={data.photo}
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
            >
              {data.label}
            </Typography>
          </Box>
        </Box>
        {/* <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} /> */}
        <Handle
          type="source"
          position="bottom"
          id="a"
          style={{
            zIndex: "999",
            width: treeAdmin ? "5px" : "0px",
            height: treeAdmin ? "5px" : "0px",
            margin: "auto",
            background: "#ddd",
            borderRadius: "15px",
            border: treeAdmin ? "2px solid #ddd" : "",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
          }}
          isConnectable={treeAdmin ? isConnectable : isConnectable}
        />
      </>
    );
  }
);
