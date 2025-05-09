export default {
  init() {
    storeValue("username", appsmith.URL.queryParams.username);
    storeValue("role", appsmith.URL.queryParams.role);
  }
}