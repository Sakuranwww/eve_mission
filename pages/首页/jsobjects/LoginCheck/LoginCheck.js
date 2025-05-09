export default {
  isLoggedIn: () => {
    return !!appsmith.store.username && !!appsmith.store.role;
  },

  isAdmin: () => {
    return appsmith.store.role === "admin";
  },

  isUser: () => {
    return appsmith.store.role === "user";
  }
}