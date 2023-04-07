import Header from "@/components/Header";
import Default from "@/components/Nodes/Default";
import Main from "@/components/Nodes/Main";
import Title from "@/components/Nodes/Title";
import {
  access,
  accessMap,
  addProgress,
  addTreeTags,
  createNode,
  createNodeEdge,
  createReaction,
  deleteNodeEdge,
  editNode,
  getAccessMap,
  getNodeAttachments,
  getNodeByTreeId,
  getNodeEdges,
  getProgress,
  getTreeById,
  getUserPurchases,
  saveUserTree,
  setProgress,
  stripePurchase,
  stripeVerifyPurchase,
} from "@/utils/api";
import {
  Box,
  CssBaseline,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Slide,
  Divider,
  Avatar,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  SelectionMode,
} from "react-flow-renderer";
import { useDispatch, useSelector } from "react-redux";
import { setNodeId } from "@/store/Node/node.action";
//import SideDrawerContainer from "@/components/Drawers/SideDrawerContainer";
import mixpanel from "mixpanel-browser";
//import ResourceDrawer from "@/components/Drawers/ResourceDrawer/ResourceDrawer";
import SignInPopup from "@/components/Popup/SignInPopup";
import { setTreeAdmin } from "@/store/newTreeData/newTree.action";
import EditNodePopup from "@/components/Popup/EditNodePopup";
import Sharepopup from "@/components/Popup/SharePopup";
import EditTreePopup from "@/components/Popup/EditTreePopup";
import Toolbar from "@/components/Toolbar";
import { media } from "../../mock/NodePhotos";
import { borderRadius } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Head from "next/head";
import { motion } from "framer-motion";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]";
import SideDrawerContainer from "@/components/Drawers/SideDrawerContainer";
import ResourceDrawer from "@/components/Drawers/ResourceDrawer/ResourceDrawer";
import { toast } from "react-toastify";
import { changeAccessMap } from "@/utils/api";
// import dynamic from "next/dynamic";

// const SideDrawerContainer = dynamic(() =>
//   import("@/components/Drawers/SideDrawerContainer")
// );
// const ResourceDrawer = dynamic(() =>
//   import("@/components/Drawers/ResourceDrawer/ResourceDrawer")
// );
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const nodeTypes = {
  selectorNode: (props) => <Default myProp="myProps" {...props} />,
  mainNode: (props) => <Main myProp="myProps" {...props} />,
  titleNode: (props) => <Title myProp="myProps" {...props} />,
};
const panOnDrag = [1, 2];

function AlertDialogSlide({
  open,
  tree,
  router,
  purchaseHandler,
  session,
  handleOpenLogin,
  paymentLoading,
}) {
  if (tree) {
    return (
      <div>
        <Dialog
          open={open}
          onClose={() => {}}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 300,
              overflow: "hidden",
            }}
          >
            <DialogTitle sx={{ maxWidth: 550 }}>{tree.name}</DialogTitle>
            <IconButton
              onClick={() => {
                router.back();
              }}
              sx={{ ml: "auto", mr: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />
          <DialogContent>
            <Box sx={{ display: "flex" }}>
              <Avatar src={tree.user.photo_url} />
              <Box sx={{ alignSelf: "center", ml: 1 }}>
                <Typography sx={{ fontWeight: 500, textAlign: "center" }}>
                  {tree.user.firstname} {tree.user.lastname}
                </Typography>
              </Box>
            </Box>
            <DialogContentText
              sx={{ mt: 1 }}
              id="alert-dialog-slide-description"
            >
              <Typography sx={{ color: "black", fontWeight: 600 }}>
                Description:{" "}
              </Typography>
              {tree.description}
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions> */}
          <Divider />
          <DialogContent>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ fontWeight: 600 }}>Price: </Typography>
              <Typography sx={{ fontWeight: 600, ml: 1 }}>
                ${tree.price.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", mt: 2 }}>
              <Box
                onClick={() => {}}
                sx={{
                  flex: 1,
                  "&:hover": { opacity: 0.7 },
                  borderRadius: 2,
                  display: "flex",
                  boxShadow: 0,
                  border: 1,
                  borderColor: "#151127",
                  cursor: "pointer",
                  mr: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography
                  sx={{ color: "#151127", fontWeight: 600, fontSize: 12 }}
                >
                  Save
                </Typography>
              </Box>
              <Box
                onClick={
                  paymentLoading
                    ? null
                    : session
                    ? purchaseHandler
                    : handleOpenLogin
                }
                sx={{
                  flex: 1,
                  "&:hover": { opacity: 0.7 },
                  borderRadius: 2,
                  display: "flex",
                  boxShadow: 0,
                  backgroundColor: paymentLoading ? "black" : "#151127",
                  cursor: "pointer",
                  mr: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                  opacity: paymentLoading ? 0.7 : 1,
                }}
              >
                {paymentLoading ? (
                  <>
                    <CircularProgress size={10} />
                    <Typography
                      sx={{
                        color: "white",
                        ml: 1,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Validating...
                    </Typography>
                  </>
                ) : (
                  <Typography
                    sx={{ color: "white", fontWeight: 600, fontSize: 12 }}
                  >
                    {tree.price == 0 ? "Start" : "Buy"} Now
                  </Typography>
                )}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

function Map() {
  const { data } = useSession();
  useEffect(() => {}, [data]);
  //const [data, setData] = useState();
  const router = useRouter();
  const { id } = router.query;
  //const [id, setId] = useState(791);
  const dispatch = useDispatch();
  const [loading, isLoading] = useState(false);
  const connectingNodeId = useRef(null);
  const edgeUpdateSuccessful = useRef(true);

  const { width, height } = useWindowDimensions();

  //   const [treeadmin, setTreeAdmin] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState([]);

  const [openUrl, setOpenUrl] = useState(false);
  const [resource, setResource] = useState();
  const [frame, setFrame] = useState("");
  const [treeDetails, setTreeDetails] = useState(null);
  const [nextMode, setNextMode] = useState(false);
  const [frameRefresh, setFrameRefresh] = useState(false);
  const [attachments, setAttachment] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [tag, setTag] = useState([]);
  const [progress, setProgress] = useState([]);
  const [access, setAccess] = useState();

  //Tree Popup Component
  const [openTree, setOpenTree] = useState(false);
  const [cover, setCover] = useState(true);
  const [paidState, setPaidSate] = useState(false);
  const [nodeLoading, setNodeLoading] = useState(false);
  const handleOpenTree = () => setOpenTree(true);
  const handleCloseTree = () => setOpenTree(false);
  //Share Popup Component
  const [openShare, setOpenShare] = useState(false);
  const handleOpenShare = () => setOpenShare(true);
  const handleCloseShare = () => setOpenShare(false);

  //Login Popup Component
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const [openEditNode, setOpenEditNode] = useState(false);

  const handleEditNodeOpen = () => setOpenEditNode(true);
  const handleEditNodeClose = () => {
    setOpenEditNode(false);
  };

  //Paid Confirm Popup

  const { node } = useSelector((state) => state.nodeData);
  const [openNode, setOpenNode] = useState(false);
  const { treeAdmin } = useSelector((state) => state.treeData);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const { project } = useReactFlow();
  const [editedTree, setEditedTree] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      category: "",
      discipline: "",
      tags: [""],
      description: "",
    }
  );

  function handleDragStop(e, node, nodeArr) {
    newNodeUpdate(node, node.label);
  }
  const newNodeUpdate = (node, label) => {
    let payload = {
      type: node.type,
      label: label || node.label || node.data.label,
      tree_id: id,
      position: node.position,
    };
    editNode(node.id, payload, id, dispatch)
      .then((res) => {
        setPopUpValues(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // toggleDrawer(false);
    //to make sure
    nodes.map((res) => {
      if (res.type == "mainNode") {
        dispatch(setNodeId(res?.id));
        setSelectedNode({
          id: res?.id,
          text: res?.label,
          type: res?.type,
          photo: res?.photo,
          index: res?.index,
        });
      }
    });
  }, []);

  const handleNodeClick = (e, node) => {
    setSelectedNode({
      id: node.id,
      text: node.label,
      type: node.type,
      index: node.index || node.data.label,
      photo: node.photo,
      type: node.type,
      index: node.index,
    });
  };

  const handleNodeBlur = () => {
    setSelectedNode(null);
  };
  function purchaseHandler() {
    setPaymentLoading(true);
    if (treeDetails.isPublic == true) {
      if (treeDetails.price == 0) {
        const payload = {
          user_id: data.user.id,
          tree_id: treeDetails.id,
          level: treeDetails.user_id == data.user.id ? "admin" : "viewer",
        };

        accessMap(payload).then((res) => {
          console.log(res);
          setCover(false);
        });
      } else {
        isLoading(true);
        stripePurchase(data.user.id, id).then((res) => {
          console.log(res.response.result);
          window.open(res.response.result.url);
          //need to check on success purchase
          //check if purchase and then set loading to false
          const payload = {
            user_id: data.user.id,
            tree_id: treeDetails.id,
            level: "unpaid",
          };

          accessMap(payload).then((res) => {
            console.log(res);
            setCover(false);
            setAccess(res.level);
          });
          isLoading(false);
        });
      }
    } else {
      toast.info("This Map Is Private");
      router.push("/");
    }
  }

  async function checkPayStatus(tree) {
    //if (!session) return false;
    setPaymentLoading(true);
    if (data) {
      if (data.user.id != tree.user_id) {
        console.log("Checking price");
        return await stripeVerifyPurchase(data.user.id, id).then((res) => {
          if (res.purchase) {
            console.log(res);
            if (res.purchase.stripe.status == "paid") {
              setCover(false);
              getAccessMap(tree.id, data.user.id).then((res) => {
                const payload = {
                  access_id: res.id,
                  user_id: data.user.id,
                  level: "viewer",
                  tree_id: tree.id,
                };
                changeAccessMap(payload).then((res) => {
                  console.log(res);
                  setAccess("viewer");
                });
              });
            } else {
              setCover(true);
            }
          } else {
            setCover(true);
          }
          setPaymentLoading(false);
        });
      }
    } else {
      setPaymentLoading(false);
      setCover(true);
    }
  }

  const toggleDrawer = (newOpen) => () => {
    if (newOpen == false) {
      setOpenNode(newOpen);
      dispatch(setNodeId(null));
      setAttachment([]);
    } else {
      setOpenNode(newOpen);
    }
  };

  function likeHandler(resource) {
    // toast.success("Liked")
    createReaction(data.user.id, resource.id, "like").then(() => {
      getNodeAttachments(resource.node_id).then((res) => {
        setAttachment(res.data);
        setResource(res.data[resource.index]);
      });
    });
  }

  function dislikeHandler(resource) {
    // toast.error("Disliked")

    createReaction(user.id, resource.id, "dislike").then(() => {
      getNodeAttachments(resource.node_id).then((res) => {
        console.log(res);
        setAttachment(res.data);
        setResource(res.data[resource.index]);
      });
    });
  }

  function nextHandler() {
    setNextMode(true);

    if (resource?.index < attachments.length - 1) {
      resouceClickHandler(attachments[resource.index + 1]);
    } else {
      // console.log('NEXT NODE', nodes[selectedNode.index + 1]);
      if (nodes[selectedNode.index + 1]?.id) {
        dispatch(setNodeId(nodes[selectedNode.index + 1]?.id));
        setSelectedNode({
          id: nodes[selectedNode.index + 1].id,
          text: nodes[selectedNode.index + 1].label,
          type: nodes[selectedNode.index + 1].type,
          index:
            nodes[selectedNode.index + 1].index ||
            nodes[selectedNode.index + 1].data.label,
          photo: nodes[selectedNode.index + 1].photo,
          type: nodes[selectedNode.index + 1].type,
          index: nodes[selectedNode.index + 1].index,
        });
      } else {
        dispatch(setNodeId(nodes[0]?.id));
        setSelectedNode({
          id: nodes[0].id,
          text: nodes[0].label,
          type: nodes[0].type,
          photo: nodes[0].photo,
          type: nodes[0].type,
          index: nodes[0].index,
        });
      }
    }
  }

  const saveTree = () => {
    if (tag.length > 0) {
      addTreeTags(tag, editedTree.id).then((res) => {
        //console.log(res);
      });
    }
    // setEditedTree({ tags: tag });

    saveUserTree(editedTree.id, editedTree)
      .then((res) => {
        setEditedTree(res);
        //Tree_Get_By_Id();

        handleCloseTree();
      })
      .catch((e) => {
        console.log(e.data.message);
      });
  };

  function handleEditNode() {
    handleEditNodeOpen();
  }

  function prevHandler() {
    setNextMode(true);

    if (resource?.index < attachments.length) {
      console.log(resource.index, "and", attachments.length - 1);
      resouceClickHandler(attachments[resource.index]);
    } else {
      dispatch(setNodeId(nodes[selectedNode.index].id));
      setSelectedNode({
        id: nodes[selectedNode.index].id,
        text: nodes[selectedNode.index].label,
        type: nodes[selectedNode.index].type,
        index:
          nodes[selectedNode.index].index ||
          nodes[selectedNode.index].data.label,
        photo: nodes[selectedNode.index].photo,
        type: nodes[selectedNode.index].type,
        index: nodes[selectedNode.index].index,
      });
    }
  }

  function selectNode(res) {
    dispatch(setNodeId(res.id));
    setSelectedNode({
      id: res.id,
      text: res.label,
      type: res.type,
      index: res.index || res.data.label,
      photo: res.photo,
      type: res.type,
      index: res.index,
    });
  }

  function resouceClickHandler(res) {
    setFrameRefresh(false);
    if (width > 800) {
      if (res) {
        const photo = res?.src;
        setResource(res);
        const url = photo
          .replace(
            "https://www.youtube.com/watch?v=",
            "https://www.youtube.com/embed/"
          )
          .split("&")[0];
        setOpenUrl(true);
        if (frame == url) {
          setFrame(null);
          setResource(null);
          setOpenUrl(false);
        } else {
          setFrame(url);
        }
      }
    } else {
      window.open(res.src);
    }

    mixpanel.track("View Resource", {
      tree_id: treeDetails?.id,
      resource_id: res.id,
      node_id: res.node_id,
      url: res.src,
    });
    console.log(res);
    if (data) {
      addProgress(data.user.id, res.node_id, res.id, res.tree_id).then(
        (res) => {
          console.log(res);
          setProgress([]);
          res.map((map) => {
            console.log(map);
            setProgress([...progress, map.resources_id]);
          });
        }
      );
    }
  }
  const onConnect = useCallback((edge) => {
    setEdges((eds) => addEdge(edge, eds));
    let newEdge = {
      source: edge.source,
      target: edge.target,
      tree_id: id,
      type: "smoothstep",
    };

    createNodeEdge(newEdge, id).then((res) => {
      getNodeEdges(id).then((res) => {
        setEdges(res);
      });
    });
  }, []);

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectStop = useCallback(
    (event) => {
      const targetIsPane = true;

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        console.log(top, left);
        console.log(event);

        const position = project({
          x: event.clientX - left - 75,
          y: event.clientY - top,
        });

        //console.log(newNode);
        //setPopUpValues({ currentName: "", newName: "", newNode: newNode });
        //setOpen(true);
        ///setOpenEditNode(true)
        //handleCreateFromNode(position);
      }
    },
    [project]
  );

  const createNodeOnServer = async (position, data) => {
    console.log(position);
    const requestOptions = {
      photo: media[5].photo,
      type: "selectorNode",
      label: "",
      tree_id: id,
      position: {
        x: position.x,
        y: position.y,
      },
      index: nodes.length,
    };
    console.log(requestOptions);
    const json = createNode(requestOptions, dispatch).then((res) => {
      return res;
    });

    return json;
  };
  const handleCreateFromNode = (position) => {
    console.log(position);

    const newNode = {
      photo: media[5].photo,
      type: "selectorNode",
      label: "",
      tree_id: id,
      position: position,
      index: nodes.length,
    };
    console.log(newNode);
    createNode(newNode).then((res) => {
      console.log(res);
      let newEdge = {
        source: connectingNodeId.current,
        target: res.id,
        tree_id: id,
        type: "smoothstep",
      };
      createNodeEdge(newEdge, id).then((res) => {
        getNodeByTreeId(id).then((res) => {
          setNodes(res);
          getNodeEdges(id).then((res) => {
            setEdges(res);
          });
          console.log(res);
        });
      });
    });
  };

  useEffect(() => {
    console.log(selectedNode);
    setOpenUrl(false);
    setResource();
    setFrame();
    setNodeLoading(true);
    setAttachment([]);
    console.log(node);
    if (node) {
      if (data && treeDetails) {
        getProgress(
          data?.user.id,
          selectedNode.type === "mainNode" ? false : parseInt(selectedNode.id),
          treeDetails.id
        ).then((res) => {
          setProgress([]);
          if (selectedNode.type === "mainNode") {
            setProgress(res);
          } else {
            res.map((map) => {
              setProgress((prev) => [...prev, map.resources_id]);
            });
          }
        });
      }
      console.log("OPEN LEFT");
      //isLoading(true);
      getNodeAttachments(node).then((res) => {
        isLoading(false);
        console.log(res);
        setNodeLoading(false);
        setAttachment(res?.data);
        if (nextMode) {
          console.log("NEXT MODE");
          console.log(res.data);
          if (res.data?.length > 0) {
            resouceClickHandler(res.data[0]);
          } else {
            nextHandler();
          }
          setNextMode(false);
        }
      });
      setOpenNode(true);
    } else {
      console.log("CLOSE LEFT");
      setOpenNode(false);
      dispatch(setNodeId(null));
    }
  }, [selectedNode]);

  useEffect(() => {
    setFrameRefresh(!frameRefresh);
  }, [frame]);
  function handleSignIn() {
    handleOpenLogin();
  }
  function editHandleOpen() {
    setOpenTree(true);
    console.log("edit map");
  }
  function shareHandleOpen() {
    handleOpenShare();
    console.log("share map");
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = project({
        x: event.clientX - left,
        y: event.clientY - top,
      });
      const newNode = {
        photo: media[Math.floor(Math.random() * 7)].photo,
        type,
        tree_id: id,
        position,
        index: nodes.length,
      };
      console.log(newNode);

      createNode(newNode).then((res) => {
        console.log(res);
        getNodeByTreeId(id).then((res) => {
          setNodes(res);
          console.log(res);
          handleEditNode();
        });
        dispatch(setNodeId(res?.id));

        setSelectedNode({
          id: res.id,
          text: res.label,
          type: res.type,
          photo: res.photo,
          index: res.index,
        });
      });
      // setPopUpValues({ currentName: "", newName: "", newNode: newNode });

      //setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, project]
  );
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    console.log(oldEdge);
    // setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      console.log(edge);
      deleteNodeEdge(edge.id).then((res) => {
        console.log(res);
        console.log(id);
        getNodeEdges(id).then((res) => {
          console.log(res);
          setEdges(res);
        });
      });

      // setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  useEffect(() => {
    dispatch(setTreeAdmin(false));
    if (id) {
      getTreeById(id).then((res) => {
        const json = res.data;
        setTreeDetails(res.data);
        console.log(res.data);
        getNodeByTreeId(id).then((res) => {
          setNodes(res);
          getNodeEdges(id).then((res) => {
            setEdges(res);
            setEditedTree(json);
          });
        });
        if (json.price > 0) {
          checkPayStatus(json);
        }
      });
    }

    if (data) {
      console.log(data.user);
      getAccessMap(id, data.user.id).then((res) => {
        console.log(res);
        if (res) {
          setCover(false);
          console.log(res);
          if (res.level == "admin") {
            dispatch(setTreeAdmin(true));
          }
          if (res.level == "editor") {
            dispatch(setTreeAdmin(true));
          }
          if (res.level == "unpaid") {
            setCover(true);
          }
          if (res.user.role === 777) {
            dispatch(setTreeAdmin(true));
          }

          setAccess(res.level);
        } else {
          setCover(true);
          //set default not claimed yet
          setAccess("new");
        }
        isLoading(false);
      });
    } else {
      //set access to some default looking thing
      setCover(true);
      setAccess("new");
      isLoading(false);
    }
  }, [data?.user.id, id]);

  // console.log(paidState);
  if (!loading && access) {
    return (
      <Box>
        <Head>
          <title>{treeDetails?.name}</title>
          <meta name="description" content={treeDetails?.description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href={treeDetails?.photo} />
          {/* <link rel="preload" as="script" href="critical.js" /> */}
        </Head>

        <>
          <CssBaseline />
          {!cover ? (
            <>
              <SideDrawerContainer
                handleOpenLogin={handleOpenLogin}
                progress={progress}
                openNode={openNode}
                toggleDrawer={toggleDrawer}
                selectedNode={selectedNode}
                nextHandler={nextHandler}
                nodes={nodes}
                treeDetails={treeDetails}
                treeAdmin={treeAdmin}
                handleEditNode={handleEditNode}
                loading={nodeLoading}
                setLoading={setNodeLoading}
                selectNode={selectNode}
                attachments={attachments}
                resource={resource}
                resouceClickHandler={resouceClickHandler}
                setAttachment={setAttachment}
              >
                {width > 800 && (
                  <ResourceDrawer
                    likeHandler={likeHandler}
                    dislikeHandler={dislikeHandler}
                    frameRefresh={frameRefresh}
                    setFrameRefresh={setFrameRefresh}
                    setFrame={setFrame}
                    frame={frame}
                    nextHandler={nextHandler}
                    openUrl={openUrl}
                    setOpenUrl={setOpenUrl}
                    resource={resource}
                    prevHandler={prevHandler}
                    treeAdmin={treeAdmin}
                  />
                )}
              </SideDrawerContainer>
              <div
                style={{ backgroundColor: "#FBF9FB" }}
                className="wrapper"
                ref={reactFlowWrapper}
              >
                <ReactFlow
                  snapToGrid={true}
                  snapGrid={[20, 20]}
                  style={{ height: "100vh", visibility: "visible" }}
                  nodes={nodes}
                  nodeTypes={nodeTypes}
                  // setViewport={setViewport}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={treeAdmin ? onEdgesChange : onEdgesChange}
                  onConnect={treeAdmin ? onConnect : null}
                  onInit={onInit}
                  nodesDraggable={treeAdmin ? true : false}
                  onNodeDragStop={treeAdmin ? handleDragStop : handleDragStop}
                  onNodeClick={treeAdmin ? handleNodeClick : handleNodeClick}
                  fitView
                  onDrop={onDrop}
                  attributionPosition="top-right"
                  onConnectStart={treeAdmin ? onConnectStart : null}
                  onConnectStop={treeAdmin ? onConnectStop : null}
                  onPaneClick={handleNodeBlur}
                  onDragOver={onDragOver}
                  onEdgeUpdate={onEdgeUpdate}
                  onEdgeUpdateStart={treeAdmin ? onEdgeUpdateStart : null}
                  onEdgeUpdateEnd={onEdgeUpdateEnd}
                  // panOnScroll
                  // selectionOnDrag
                  // panOnDrag={panOnDrag}
                >
                  <Box
                    sx={{ zIndex: 1000, position: "absolute", width: "100%" }}
                  >
                    <Header
                      session={data}
                      editHandleOpen={editHandleOpen}
                      shareHandleOpen={shareHandleOpen}
                      handleSignIn={handleSignIn}
                      treeDetails={treeDetails}
                      treeadmin={treeAdmin}
                    />
                  </Box>
                  <Controls showInteractive={false} />
                  <Background color="#aaa" gap={20} />
                  {access == "admin" || access == "editor" ? (
                    <Box
                      sx={{
                        zIndex: 1000,
                        position: "absolute",
                        top: "90%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#FEFEFF",
                        borderRadius: 2,
                        boxShadow: "0px 5px 40px -2px rgba(0,0,0,0.15)",
                        px: 4,
                        py: 1,
                      }}
                    >
                      {" "}
                      <Toolbar />
                    </Box>
                  ) : (
                    <></>
                  )}
                </ReactFlow>
              </div>
            </>
          ) : (
            <div style={{ backgroundColor: "#FBF9FB" }} className="wrapper">
              <AlertDialogSlide
                session={data?.user}
                open={cover}
                tree={treeDetails}
                router={router}
                purchaseHandler={purchaseHandler}
                handleOpenLogin={handleOpenLogin}
                paymentLoading={paymentLoading}
              />
              <ReactFlow
                snapToGrid={true}
                snapGrid={[20, 20]}
                style={{ height: "100vh", visibility: "visible" }}
                nodes={nodes}
                nodeTypes={nodeTypes}
                // setViewport={setViewport}
                edges={edges}
                onInit={onInit}
                fitView
                attributionPosition="top-right"
                panOnDrag={false}
                // panOnScroll
                // selectionOnDrag
                // panOnDrag={panOnDrag}
                zoomOnDoubleClick={false}
                zoomOnScroll={false}
              >
                <Box sx={{ zIndex: 1000, position: "absolute", width: "100%" }}>
                  <Header
                    session={data}
                    editHandleOpen={editHandleOpen}
                    shareHandleOpen={shareHandleOpen}
                    handleSignIn={handleSignIn}
                    treeDetails={treeDetails}
                    treeadmin={treeAdmin}
                  />
                </Box>

                <Controls />
                <Background color="#aaa" gap={20} />
                {treeAdmin && (
                  <Box
                    sx={{
                      zIndex: 1000,
                      position: "absolute",
                      top: "90%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#FEFEFF",
                      borderRadius: 2,
                      boxShadow: "0px 5px 40px -2px rgba(0,0,0,0.15)",
                      px: 4,
                      py: 1,
                    }}
                  >
                    {" "}
                    <Toolbar />
                  </Box>
                )}
              </ReactFlow>
            </div>
          )}
          {cover == null && (
            <Box
              sx={{
                background: "#00000017",
                display: "flex",
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={100} />
            </Box>
          )}
          {openLogin && (
            <SignInPopup
              setOpenLogin={setOpenLogin}
              treeDetails={treeDetails}
              //saveTree={saveTree}
              open={openLogin}
              handleCloseLogin={handleCloseLogin}
              setEditedTree={setEditedTree}
            />
          )}
          {openTree && (
            <EditTreePopup
              tag={tag}
              setTag={setTag}
              saveTree={saveTree}
              editedTree={editedTree}
              open={openTree}
              handleClose={handleCloseTree}
              treeDetails={treeDetails}
              setEditedTree={setEditedTree}
            />
          )}
          {openEditNode && (
            <EditNodePopup
              selectedNode={selectedNode}
              open={openEditNode}
              handleClose={handleEditNodeClose}
              treeDetails={treeDetails}
              setSelectedNode={setSelectedNode}
              toggleDrawer={toggleDrawer(false)}
              //setEditedTree={setEditedTree}
              dispatch={dispatch}
              setNodes={setNodes}
            />
          )}
          {openShare && (
            <Sharepopup
              saveTree={saveTree}
              setEditedTree={setEditedTree}
              openShare={openShare}
              tree={treeDetails}
              setTreeDetails={setTreeDetails}
              handleCloseShare={handleCloseShare}
              setOpenShare={setOpenShare}
            />
          )}
        </>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          background: "#00000017",
          display: "flex",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.div
          animate={{
            scale: [2, 1, 2, 1, 1],
            rotate: [0, 360, 180, 180, 360],
            borderRadius: ["0%", "0%", "50%", "50%", "0%"],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <img width={40} height={40} src="/icon.png" />
        </motion.div>
        {/* <CircularProgress size={50} /> */}
      </Box>
    );
  }
}

export default function MapProvider(props) {
  return (
    <ReactFlowProvider>
      <Map {...props} />
    </ReactFlowProvider>
  );
}

// export async function getServerSideProps({ req }) {
//   const session = await getSession({ req });

//   // if (!session) {
//   //   return {
//   //     redirect: {
//   //       destination: "/",
//   //       permanent: false,
//   //     },
//   //   };
//   // }
//   return {
//     props: { data: session },
//   };
// }
