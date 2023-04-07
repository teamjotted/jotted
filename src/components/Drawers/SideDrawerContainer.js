import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import { Box, Drawer, SwipeableDrawer } from "@mui/material";
import { useState } from "react";
import CommentNodeContent from "./CommentNodeContent";
import MainNodeSidebar from "./MainNodeContent";
import SubNodeContent from "./SubNodeContent";

export default function SideDrawerContainer({
  openNode,
  toggleDrawer,
  selectedNode,
  nextHandler,
  nodes,
  loading,
  treeDetails,
  treeAdmin,
  handleEditNode,
  attachments,
  setAttachment,
  selectNode,
  resource,
  resouceClickHandler,
  children,
  setLoading,
  progress,
  handleOpenLogin,
}) {
  const [tab, setTab] = useState(1);
  const { width, height } = useWindowDimensions();
  return (
    <Drawer
      elevation={10}
      ModalProps={{
        disableScrollLock: true,
        BackdropProps: { invisible: true },
      }}
      sx={{
        ".MuiDrawer-paperAnchorBottom": {
          borderTopLeftRadius: width >= 450 ? 10 : 0,
          borderTopRightRadius: width >= 450 ? 10 : 0,
          height: width >= 450 ? height - 75 : height - 75,
          mx: width >= 450 ? 2 : 0,
          overflowY: width >= 450 ? "hidden" : "auto",
          overflowX: "hidden",
          maxWidth: width >= 450 ? 450 : width,
        },
      }}
      anchor={"bottom"}
      open={openNode}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
    >
      {tab == 1 ? (
        <Box>
          {selectedNode?.type == "mainNode" ? (
            <MainNodeSidebar
              tab={tab}
              setTab={setTab}
              progress={progress}
              nextHandler={nextHandler}
              treeDetails={treeDetails}
              selectedNode={selectedNode}
              treeAdmin={treeAdmin}
              nodes={nodes}
              handleEditNode={handleEditNode}
              selectNode={selectNode}
            />
          ) : (
            <SubNodeContent
              tab={tab}
              setTab={setTab}
              progress={progress}
              setLoading={setLoading}
              handleEditNode={handleEditNode}
              attachments={attachments}
              selectedNode={selectedNode}
              treeAdmin={treeAdmin}
              resource={resource}
              resouceClickHandler={resouceClickHandler}
              tree={treeDetails}
              loading={loading}
              setAttachment={setAttachment}
            />
          )}
        </Box>
      ) : (
        <></>
      )}
      {tab == 2 ? (
        <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
          <CommentNodeContent
            handleOpenLogin={handleOpenLogin}
            tab={tab}
            setTab={setTab}
            progress={progress}
            setLoading={setLoading}
            handleEditNode={handleEditNode}
            attachments={attachments}
            selectedNode={selectedNode}
            treeAdmin={treeAdmin}
            resource={resource}
            resouceClickHandler={resouceClickHandler}
            tree={treeDetails}
            loading={loading}
            setAttachment={setAttachment}
          />
        </Box>
      ) : (
        <></>
      )}

      {children}
    </Drawer>
  );
}
