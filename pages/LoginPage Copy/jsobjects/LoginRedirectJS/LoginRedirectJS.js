export default {
  redirectIfLoggedIn: async () => {
    if (appsmith.store.isLoggedIn) {
      navigateTo("HomePage Copy");
    }
  }
}