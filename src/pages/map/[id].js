import Header from "@/components/Header";
import Default from "@/components/Nodes/Default";
import Main from "@/components/Nodes/Main";
import Title from "@/components/Nodes/Title";
import { getNodeByTreeId, getNodeEdges, getTreeById } from "@/utils/api";
import { Box } from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
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

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const nodeTypes = {
  selectorNode: (props) => <Default myProp="myProps" {...props} />,
  mainNode: (props) => <Main myProp="myProps" {...props} />,
  titleNode: (props) => <Title myProp="myProps" {...props} />,
};
const panOnDrag = [1, 2];
export default function Map({ data }) {
  const router = useRouter();
  const { id } = router.query;
  const [loading, isLoading] = useState(false);
  const [treeadmin, setTreeAdmin] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectorNode, setSelectedNode] = useState([]);
  const [filterValues, setFilterValues] = useState({ nodeId: "" });

  const reactFlowWrapper = useRef(null);

  const [editedTree, setEditedTree] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: "",
      is_organization: 0,
      category: "",
      discipline: "",
      age_group: "",
      tags: [""],
      description: "",
      title: "",
      topic: "",
      snapshot: "",
      last_viewed: 0,
    }
  );
  const onConnect = useCallback((edge) => {
    setEdges((eds) => addEdge(edge, eds));
    let newEdge = {
      source: edge.source,
      target: edge.target,
      tree_id: treeid,
      type: "smoothstep",
    };
    createEdgeOnServer(newEdge);
  }, []);
  function handleDragStop(e, node, nodeArr) {
    console.log(node);
    newNodeUpdate(node, node.label);
  }

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

    console.log(node);
  };
  const handleNodeBlur = () => {
    setSelectedNode(null);
    setFilterValues({ nodeId: "" });
  };

  useEffect(() => {
    isLoading(true);
    if (id) {
      console.log(id);
      getTreeById(id).then((res) => {
        console.log(res);
        getNodeByTreeId(id).then((res) => {
          isLoading(false);
          setNodes(res);
          console.log(res);
        });
        getNodeEdges(id).then((res) => {
          isLoading(false);
          setEdges(res);
          console.log(res);
        });
      });
    }
  }, [id]);

  //run this on start map to start play option
  //   const handleTransform = useCallback(() => {
  //     setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
  //   }, [setViewport]);

  return (
    <Box>
      <ReactFlowProvider>
        <div className="wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            snapToGrid={true}
            snapGrid={[20, 20]}
            style={{ height: "100vh", visibility: "visible" }}
            nodes={nodes}
            nodeTypes={nodeTypes}
            // setViewport={setViewport}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={treeadmin ? onEdgesChange : onEdgesChange}
            onConnect={treeadmin ? onConnect : onConnect}
            onInit={onInit}
            nodesDraggable={treeadmin ? true : false}
            onNodeDragStop={treeadmin ? handleDragStop : handleDragStop}
            onNodeClick={treeadmin ? handleNodeClick : handleNodeClick}
            fitView
            attributionPosition="top-right"
            onConnectStart={treeadmin ? onConnectStart : null}
            onConnectStop={treeadmin ? onConnectStop : null}
            onPaneClick={handleNodeBlur}
            // panOnScroll
            // selectionOnDrag
            // panOnDrag={panOnDrag}
          >
            <Box sx={{ zIndex: 1000, position: "absolute", width: "100%" }}>
              <Header user={data?.user} />
            </Box>
            <Controls />
            <Background color="#aaa" gap={20} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </Box>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }
  return {
    props: { data: session },
  };
}
