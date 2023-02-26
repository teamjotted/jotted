import Header from "@/components/Header";
import Default from "@/components/Nodes/Default";
import Main from "@/components/Nodes/Main";
import Title from "@/components/Nodes/Title";
import {
  addTreeTags,
  createNode,
  createNodeEdge,
  createReaction,
  deleteNodeEdge,
  editNode,
  getNodeAttachments,
  getNodeByTreeId,
  getNodeEdges,
  getTreeById,
  getUserPurchases,
  saveUserTree,
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
import SideDrawerContainer from "@/components/Drawers/SideDrawerContainer";
import mixpanel from "mixpanel-browser";
import ResourceDrawer from "@/components/Drawers/ResourceDrawer/ResourceDrawer";
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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DialogTitle>{tree.name}</DialogTitle>
            <IconButton
              onClick={() => {
                router.push("/");
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
                  borderColor: "#00A4FF",
                  cursor: "pointer",
                  mr: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography
                  sx={{ color: "#00A4FF", fontWeight: 600, fontSize: 12 }}
                >
                  Save
                </Typography>
              </Box>
              <Box
                onClick={session ? purchaseHandler : handleOpenLogin}
                sx={{
                  flex: 1,
                  "&:hover": { opacity: 0.7 },
                  borderRadius: 2,
                  display: "flex",
                  boxShadow: 0,
                  backgroundColor: "#00A4FF",
                  cursor: "pointer",
                  mr: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Typography
                  sx={{ color: "white", fontWeight: 600, fontSize: 12 }}
                >
                  Buy Now
                </Typography>
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
  //const [data, setData] = useState();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [loading, isLoading] = useState(false);
  const connectingNodeId = useRef(null);
  const edgeUpdateSuccessful = useRef(true);

  //   const [treeadmin, setTreeAdmin] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState([]);
  const [popUpValues, setPopUpValues] = useState(null);
  const [popUpValueName, setPopUpValueName] = useState(null);
  const [filterValues, setFilterValues] = useState({ nodeId: "" });
  const [openUrl, setOpenUrl] = useState(false);
  const [resource, setResource] = useState();
  const [frame, setFrame] = useState("");
  const [treeDetails, setTreeDetails] = useState(null);
  const [nextMode, setNextMode] = useState(false);
  const [frameRefresh, setFrameRefresh] = useState(false);
  const [attachments, setAttachment] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [unLinked, setUnLinked] = useState(false);
  const [tag, setTag] = useState([]);
  //Tree Popup Component
  const [openTree, setOpenTree] = useState(false);
  const [paidState, setPaidSate] = useState();
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
  const onConnect = useCallback((edge) => {
    setEdges((eds) => addEdge(edge, eds));
    let newEdge = {
      source: edge.source,
      target: edge.target,
      tree_id: id,
      type: "smoothstep",
    };
    createNodeEdge(dispatch, newEdge, id);
  }, []);
  function handleDragStop(e, node, nodeArr) {
    console.log(node);
    newNodeUpdate(node, node.label);
  }
  const newNodeUpdate = (node, label) => {
    //console.log('NODE DRAGGED');
    let payload = {
      type: node.type,
      label: label || node.label || node.data.label,
      tree_id: id,
      position: node.position,
    };
    editNode(node.id, payload, id, dispatch)
      .then((res) => {
        setPopUpValues(null);
        console.log(nodes);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNodeClick = (e, node) => {
    console.log("NODE", node);

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
    setFilterValues({ nodeId: "" });
  };
  function purchaseHandler() {
    stripePurchase(data.user.id, id).then((res) => {
      console.log(res);
      window.open(res.response.result.url);
      //need to check on success purchase
    });
  }

  async function checkPayStatus() {
    console.log(treeDetails);
    //if (!session) return false;

    return await stripeVerifyPurchase(data.user.id, id).then((res) => {
      if (res.purchase) {
        if (res.purchase.stripe.status == "paid") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
  }

  // useEffect(() => {
  //   // toggleDrawer(false);

  //   nodes.map((res) => {
  //     if (res.type == "mainNode") {
  //       console.log(res);
  //       dispatch(setNodeId(res?.id));
  //       setSelectedNode({
  //         id: res?.id,
  //         text: res?.label,
  //         type: res?.type,
  //         index: res?.index || res?.data.label,
  //         photo: res?.photo,
  //         type: res?.type,
  //         index: res?.index,
  //       });
  //     }
  //   });
  // }, [nodes]);

  async function paidMapHandler(json) {
    if (data) {
      const status = await checkPayStatus();

      console.log(status);
      if (status) {
        setPaidSate(true);
        isLoading(false);
        return;
      } else {
        setPaidSate(false);
        isLoading(false);
        return;
      }
    } else {
      setPaidSate(false);
      isLoading(false);
    }
  }
  function privateTreeHandler(json) {
    return false;
  }

  useEffect(() => {
    isLoading(true);
    dispatch(setTreeAdmin(false));
    if (id) {
      //isLoading(true);
      console.log(id);
      getTreeById(id).then((res) => {
        const json = res.data;
        setTreeDetails(res.data);
        getNodeByTreeId(id).then((res) => {
          setNodes(res);
          console.log(res);
          getNodeEdges(id).then((res) => {
            setEdges(res);
            console.log(res);
            setEditedTree(json);
            console.log("Tree Data", json);

            // switch (json.isPublic) {
            //   case true:
            //     if(session){
            //     isLoading(publicTreeHandler(json));
            //     console.log("true");
            //     } else{

            //     }
            //     break;
            //   case false:
            //     privateTreeHandler(json);
            //     console.log("false");
            //     break;
            //   default:
            // }
            if (json.isPublic == true) {
              if (json.user_id == data?.user.id && data) {
                setPaidSate(true);
                console.log("This is a Tree Admin");
                dispatch(setTreeAdmin(true));
                isLoading(false);
              } else {
                if (json.price == 0) {
                  setPaidSate(true);
                  isLoading(false);
                  if (data?.user.role == 777) {
                    console.log(" This is a Master Admin");
                    dispatch(setTreeAdmin(true));
                  } else {
                    console.log(data);
                    console.log("This is not a Tree Admin");
                    dispatch(setTreeAdmin(false));
                  }
                } else {
                  paidMapHandler(json);
                }
              }
            } else {
              setPaidSate(true);
              if (json.user_id == data?.user.id) {
                dispatch(setTreeAdmin(true));
                isLoading(false);
              } else {
                const shared = json.shared_users.find(
                  (res) => res.user_id === data?.user.id
                );
                if (shared) {
                  if (shared.role == "viewer") {
                    dispatch(setTreeAdmin(false));
                    isLoading(false);
                  }
                  if (shared.role == "editor") {
                    dispatch(setTreeAdmin(true));
                    isLoading(false);
                  }
                  // console.log(shared);
                } else {
                  if (data?.user.id === 456) {
                    console.log("Session is an Admin");
                    dispatch(setTreeAdmin(true));
                    isLoading(false);
                  } else {
                    router.push("/");
                  }
                }
              }
            }
          });
        });

        // setEditedTree(json);
      });
    }
  }, [id, data]);
  const toggleDrawer = (newOpen) => () => {
    console.log(attachments);
    if (newOpen == false) {
      setOpenNode(newOpen);
      dispatch(setNodeId(null));
      setAttachment([]);
    } else {
      setOpenNode(newOpen);
    }
  };
  function likeHandler(resource) {
    console.log("like", resource);
    // toast.success("Liked")
    createReaction(user.id, resource.id, "like").then(() => {
      console.log(resource.tree_id);
      getNodeAttachments(resource.node_id).then((res) => {
        console.log(res);
        setAttachment(res.data);
        setResource(res.data[resource.index]);
      });
    });
  }

  function dislikeHandler(resource) {
    // toast.error("Disliked")
    console.log("dislike", resource);
    createReaction(user.id, resource.id, "dislike").then(() => {
      console.log(resource.tree_id);
      getNodeAttachments(resource.node_id).then((res) => {
        console.log(res);
        setAttachment(res.data);
        setResource(res.data[resource.index]);
      });
    });
  }
  function nextHandler() {
    setNextMode(true);
    console.log(resource);
    console.log(attachments);
    console.log(selectedNode);
    if (resource?.index < attachments.length - 1) {
      console.log(resource.index, "and", attachments.length - 1);
      resouceClickHandler(attachments[resource.index + 1]);
    } else {
      console.log("NEXT NODE");
      console.log("SLECTED NODE", selectedNode);
      console.log("LIST OF NODES", nodes);
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
    console.log("SAVED TREE", editedTree);
    console.log(tag);
    if (tag.length > 0) {
      addTreeTags(tag, editedTree.id).then((res) => {
        //console.log(res);
      });
    }
    // setEditedTree({ tags: tag });
    console.log(editedTree);
    saveUserTree(editedTree.id, editedTree)
      .then((res) => {
        console.log(res);
        setEditedTree(res);
        //Tree_Get_By_Id();

        handleCloseTree();
      })
      .catch((e) => {
        console.log(e.data.message);
      });
  };
  function handleEditNode() {
    console.log(selectedNode, node);
    handleEditNodeOpen();
  }
  function prevHandler() {
    setNextMode(true);
    console.log(resource);
    console.log(attachments);
    console.log(selectedNode);
    if (resource?.index < attachments.length) {
      console.log(resource.index, "and", attachments.length - 1);
      resouceClickHandler(attachments[resource.index]);
    } else {
      console.log("NEXT NODE");
      console.log(selectedNode);
      console.log(nodes);
      console.log(nodes[selectedNode.index]?.id);
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
    console.log("CLICKED", res);
    if (res) {
      //   mixpanel.track("View Resource", {
      //     tree_id: treeDetails?.id,
      //     resource_id: res.id,
      //     node_id: res.node_id,
      //     url: res.src,
      //   });

      const photo = res?.src;
      setResource(res);
      const url = photo
        .replace(
          "https://www.youtube.com/watch?v=",
          "https://www.youtube.com/embed/"
        )
        .split("&")[0];
      setOpenUrl(true);
      console.log(url);
      if (frame == url) {
        setFrame(null);
        setResource(null);
        setOpenUrl(false);
      } else {
        setFrame(url);
      }
    }
  }
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectStop = useCallback(
    (event) => {
      const targetIsPane = true;

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();

        const newNode = {
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          data: {
            label: "",
            position: project({
              x: event.clientX - left - 75,
              y: event.clientY - top,
            }),
          },
        };
        console.log(newNode);
        setPopUpValues({ currentName: "", newName: "", newNode: newNode });
      }
    },
    [project]
  );

  useEffect(() => {
    console.log(selectedNode);
    setOpenUrl(false);
    setResource();
    setFrame();
    setAttachment([]);
    console.log(node);
    if (node) {
      console.log("OPEN LEFT");
      //isLoading(true);
      getNodeAttachments(node).then((res) => {
        isLoading(false);
        console.log(res);
        setAttachment(res?.data);
        if (nextMode) {
          console.log("NEXT MODE");
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
        x: event.clientX - left - 75,
        y: event.clientY - top,
      });
      const newNode = {
        photo: media[Math.floor(Math.random() * 20).photo],
        type,
        tree_id: id,
        position,
        data: {
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
        },
        index: nodes.length,
      };
      console.log(newNode);
      createNode(newNode).then((res) => {
        console.log(res);
        getNodeByTreeId(id).then((res) => {
          setNodes(res);
          console.log(res);
        });
      });
      // setPopUpValues({ currentName: "", newName: "", newNode: newNode });

      //setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
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
        getNodeEdges(id).then((res) => {
          console.log(res);
          setEdges(res);
        });
      });

      // setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  // console.log(paidState);
  if (!loading) {
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
          {paidState ? (
            <>
              <SideDrawerContainer
                openNode={openNode}
                toggleDrawer={toggleDrawer}
                selectedNode={selectedNode}
                nextHandler={nextHandler}
                nodes={nodes}
                treeDetails={treeDetails}
                treeAdmin={treeAdmin}
                handleEditNode={handleEditNode}
                selectNode={selectNode}
                attachments={attachments}
                resource={resource}
                resouceClickHandler={resouceClickHandler}
                setAttachment={setAttachment}
              >
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
                  onConnect={treeAdmin ? onConnect : onConnect}
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
                  onEdgeUpdateStart={onEdgeUpdateStart}
                  onEdgeUpdateEnd={onEdgeUpdateEnd}
                  // panOnScroll
                  // selectionOnDrag
                  // panOnDrag={panOnDrag}
                >
                  <Box
                    sx={{ zIndex: 1000, position: "absolute", width: "100%" }}
                  >
                    <Header
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
            </>
          ) : (
            <div
              style={{ backgroundColor: "#FBF9FB" }}
              className="wrapper"
              ref={reactFlowWrapper}
            >
              <AlertDialogSlide
                session={data?.user}
                open={!paidState}
                tree={treeDetails}
                router={router}
                purchaseHandler={purchaseHandler}
                handleOpenLogin={handleOpenLogin}
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
          {paidState == null && (
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
