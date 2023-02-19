// import { getnewTreeApiFn, newTreeApiFn } from '../../services/API/Authenication.api';
import Types from "./newTree.type";

export const setTreeAdmin = (payload) => {
  return {
    type: Types.setTreeAdmin,
    payload,
  };
};

export const setNewTree = (payload) => {
  return (dispatch) => {};
};

export const getNewTree = (payload) => {
  return (dispatch) => {};
};
