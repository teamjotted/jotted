import React, { memo, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Handle } from "react-flow-renderer";
import {
  deleteNodeAttachments,
  editNoteAttachments,
  getNodeAttachments,
  getNodeDetailsById,
} from "../../utils/api";

import { useDispatch, useSelector } from "react-redux";

export default memo(
  ({ data, isConnectable, id, position, xPos, yPos, ...props }) => {
    const dispatch = useDispatch();

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

    useEffect(() => {
      console.log(data);
      if (id) {
        getNodeDetailsById(id).then((res) => {
          getNodeAttachments(id).then((res) => {
            //setAttachments(res.data);
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
            width: treeAdmin ? "2px" : "",
            height: treeAdmin ? "2px" : "",
            margin: "auto",
            background: "#ddd",
            borderRadius: "15px",
            border: treeAdmin ? "2px solid #ddd" : "",
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px",
          }}
          onConnect={(params) => console.log("handle onConnect", params)}
          isConnectable={treeAdmin ? isConnectable : isConnectable}
        />
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "100%",
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
            width: treeAdmin ? "2px" : "",
            height: treeAdmin ? "2px" : "",
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
