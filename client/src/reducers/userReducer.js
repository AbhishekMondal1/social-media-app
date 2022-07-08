export const initialState = null

export const reducer = (state, action) => {
    if (action.type === "USER") {
        return action.payload
    }
    if(action.type === "CLEAR"){
        return null
    }
    if (action.type === "UPDATE_FOLLOWING") {
        return {
            ...state,
            totalFollowing: action.payload.totalFollowing
        }
    }
    if (action.type === "UPDATEPIC") {
      return {
        ...state,
        pic: action.payload,
      };
    }
    return state
}