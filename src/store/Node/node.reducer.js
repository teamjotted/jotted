import Types from './node.type';

const initialState = {
	nodes: [],
	node: null,
	edges: []
};

const nodeReducer = (state = initialState, action) => {
	switch (action.type) {
		case Types.setNodes:
			return {
				...state,
				nodes: action.payload
			};

		case Types.setNodeId:
			return {
				...state,
				node: action.payload
			};

		case Types.setEdges:
			return {
				...state,
				edges: action.payload
			};

		default:
			return state;
	}
};

export default nodeReducer;
