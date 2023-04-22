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
import { media } from "../../../mock/NodePhotos";
import { borderRadius } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Head from "next/head";
import { motion } from "framer-motion";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]";
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
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", ml: "auto" }}>
      <CircularProgress color={"inherit"} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 10,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 12 }}>
          {props.viewedAmount}/{props.totalAmount}
        </Typography>
      </Box>
    </Box>
  );
}

function AlertDialogSlide({
  open,
  tree,
  router,
  purchaseHandler,
  session,
  handleOpenLogin,
  paymentLoading,
  nodes,
  paid,
}) {
  if (tree) {
    return (
      <div>
        <Dialog
          scroll={"paper"}
          open={open}
          onClose={() => {}}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          sx={{
            ".MuiDrawer-paperAnchorBottom": {
              "&::-webkit-scrollbar": {
                width: "0.2em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                borderRadius: 3,
                opacity: 0.4,
              },
            },
          }}
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
                router.push("/");
              }}
              sx={{ ml: "auto", mr: 1 }}
            >
              <ArrowBackIosIcon
                sx={{
                  pl: 0.6,
                }}
              />
            </IconButton>
          </Box>

          <Divider />
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                maxHeight: 400,
                p: 1,
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.2em",
                },
                "&::-webkit-scrollbar-track": {
                  boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,.1)",
                  borderRadius: 3,
                  opacity: 0.4,
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 400,
                    height: 300,
                    backgroundImage: `url('${tree?.photo}')`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    position: "relative",
                    backgroundColor: "white",
                    borderRadius: 2,
                    overflowX: "hidden",
                    overflowY: "auto",
                    "&:hover": {
                      opacity: 0.8,
                      cursor: "pointer",
                    },
                  }}
                ></Box>
                <Box
                  sx={{
                    boxShadow: "0px 1px 9px rgba(0, 0, 0, 0.09)",
                    borderRadius: 3,
                    p: 2,
                    my: 1,
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                      About the insructor
                    </Typography>
                    <Typography
                      onClick={() => {
                        router.push(`/user/${tree.user.id}`);
                      }}
                      sx={{ ml: "auto", cursor: "pointer" }}
                    >
                      View profile{" "}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", my: 1 }}>
                    <Avatar
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        router.push(`/user/${tree.user.id}`);
                      }}
                      src={tree.user.photo_url}
                    />
                    <Box sx={{ alignSelf: "center", ml: 1 }}>
                      <Typography sx={{ fontWeight: 500, textAlign: "center" }}>
                        {tree.user.firstname} {tree.user.lastname}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{my:1}}>
                  <Typography sx={{ color: "black", fontWeight: 600 }}>
                    Description:{" "}
                  </Typography>
                  <Typography variant="body1" sx={{ width: 400,my:1 }}>
                    {tree.description}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ color: "black", fontWeight: 600 }}>
                    Map conent:{" "}
                  </Typography>
                  {nodes.map((res, index) => {
                    const node_id = parseInt(res.id);

                    const totalAmount = res.data.resources;

                    const progressAmount = ((0 / totalAmount) * 100).toFixed(0);
                    return (
                      <>
                        <motion.div
                          // initial={{ scale: 0 }}
                          animate={{ y: 0 }}
                          transition={{
                            // type: "spring",
                            duration: 0.2,
                            stiffness: 150,
                          }}
                          whileHover={{ y: -1.5 }}
                        >
                          <Box
                            sx={{
                              flexDirection: "column",
                              borderRadius: 2,
                              my: 1.1,
                              mx: 1,
                              display: "flex",
                              backgroundColor: "white",
                              maxWidth: 470,
                              overflow: "hidden",
                              boxShadow: "0px 1px 9px rgba(0, 0, 0, 0.09)",
                              "&:hover": {
                                boxShadow: "0px 1px 9px rgba(0, 0, 0, 0.16)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                display: "flex",
                                "&:hover": {
                                  color:
                                    res.type == "mainNode" ? "" : "#151127",
                                },
                              }}
                            >
                              <Box
                                component={"img"}
                                width={50}
                                height={50}
                                sx={{
                                  borderRadius: 2,
                                  mr: 1,
                                  alignSelf: "center",
                                }}
                                src={res.photo}
                              />
                              <Box sx={{ cursor: "pointer", ml: 2 }}>
                                <>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 800,
                                      fontSize: 12,
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 2,
                                    }}
                                  >
                                    {res.index} | {res.data.label}
                                  </Typography>
                                </>
                              </Box>
                              <CircularProgressWithLabel
                                sx={{ ml: "auto" }}
                                value={progressAmount}
                                viewedAmount={0}
                                totalAmount={totalAmount}
                              />
                            </Box>
                          </Box>
                        </motion.div>
                      </>
                    );
                  })}
                </Box>
              </Box>
            </Box>
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
                  Cancel
                </Typography>
              </Box>
              <Box
                onClick={
                  paymentLoading
                    ? null
                    : session
                    ? paid
                      ? router.push(`${tree.id}/view`)
                      : purchaseHandler
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
                    {tree.price == 0 ? "Go to" : paid ? "Continue" : "Buy"} map
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

  //   const [treeadmin, setTreeAdmin] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState([]);

  const [frame, setFrame] = useState("");
  const [treeDetails, setTreeDetails] = useState(null);

  const [frameRefresh, setFrameRefresh] = useState(false);

  const [openLogin, setOpenLogin] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [tag, setTag] = useState([]);
  const [progress, setProgress] = useState([]);
  const [access, setAccess] = useState();

  //Tree Popup Component
  const [openTree, setOpenTree] = useState(false);
  const [cover, setCover] = useState(true);
  const [paid, setPaid] = useState(false);
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

  const { treeAdmin } = useSelector((state) => state.treeData);

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
              setPaid(true);
              getAccessMap(tree.id, data.user.id).then((res) => {
                console.log("THIS MAP WAS PAID FOR");
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
      } else {
        setPaymentLoading(false);
        setPaid(true);
        //router.push(`${id}/view`)
      }
    } else {
      setPaymentLoading(false);
      setCover(true);
    }
  }

  useEffect(() => {
    isLoading(true);
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
          //router.push(`${id}/view`)
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
          router.push(`${id}/view`);
        });
      } else {
        isLoading(true);
        //checker here if paid go to router if not stripe purchase activate
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
            router.push(`${id}/view`);
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
          <div style={{ backgroundColor: "#FBF9FB" }} className="wrapper">
            <AlertDialogSlide
              paid={paid}
              session={data?.user}
              open={true}
              tree={treeDetails}
              nodes={nodes}
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

// export async function getServerSideProps(context) {
//   const session = await getServerSession(context.req, context.res, options);
//   console.log("in map session ---------", session);
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
