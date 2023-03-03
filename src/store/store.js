//created by talbert herndon

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import userDataReducer from "./userData/userData.reducer";
import treeDataReducer from "./newTreeData/newTree.reducer";
import nodeDataReducer from "./Node/node.reducer";
const combinedReducer = combineReducers({
  userData: userDataReducer,
  treeData: treeDataReducer,
  nodeData: nodeDataReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: combinedReducer,
  });

export const wrapper = createWrapper(makeStore, { debug: true });
