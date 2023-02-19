import Types from './node.type';

export const setNodes = (payload) => {
	return {
		type: Types.setNodes,
		payload
	};
};
export const setNodeId = (payload) => {
	return {
		type: Types.setNodeId,
		payload
	};
};

export const setEdges = (payload) => {
	return {
		type: Types.setEdges,
		payload
	};
};
