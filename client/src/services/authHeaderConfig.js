export const authHeader = () => {
  const token = localStorage.getItem("jwt");
  let config = "";
  if (token) {
    config = {
      Authorization: "Bearer " + token,
    };
  }
  return config;
};
