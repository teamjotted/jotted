
import Types from './userData.type';

export const getAllUserInfo = (payload) => {
	return {
		type: Types.getUserData,
		payload: payload
	};
};
export const getErrorUserInfo = (payload) => {
	return {
		type: Types.errorUserData,
		payload: payload
	};
};


