enum Actions {
  // action types
  ADD_BODY_CLASSNAME = "addBodyClassName",
  REMOVE_BODY_CLASSNAME = "removeBodyClassName",
  ADD_BODY_ATTRIBUTE = "addBodyAttribute",
  REMOVE_BODY_ATTRIBUTE = "removeBodyAttribute",
  ADD_CLASSNAME = "addClassName",
  VERIFY_AUTH = "verifyAuth",
  LOGIN = "login",
  LOGOUT = "logout",
  REGISTER = "register",
  UPDATE_USER = "updateUser",
  FORGOT_PASSWORD = "forgotPassword",
  SET_BREADCRUMB_ACTION = "setBreadcrumbAction",
  GET_REQUEST_STATISTICS_ACTION = "getRequestStatisticsAction",
  GET_CUSTOMERS_SCORE_ACTION = "getCustomersScoreAction",
  SYNC_KALAPA_SCORE_ACTION = "syncKalapaScoreAction",
  EXPORT_CUSTOMERS_SCORE_ACTION = "exportCustomerScoreAction",
}

enum Mutations {
  // mutation types
  SET_CLASSNAME_BY_POSITION = "appendBreadcrumb",
  PURGE_AUTH = "logOut",
  SET_AUTH = "setAuth",
  SET_USER = "setUser",
  SET_PASSWORD = "setPassword",
  SET_ERROR = "setError",
  SET_BREADCRUMB_MUTATION = "setBreadcrumbMutation",
  SET_LAYOUT_CONFIG = "setLayoutConfig",
  RESET_LAYOUT_CONFIG = "resetLayoutConfig",
  OVERRIDE_LAYOUT_CONFIG = "overrideLayoutConfig",
  OVERRIDE_PAGE_LAYOUT_CONFIG = "overridePageLayoutConfig",
  GET_REQUEST_STATISTICS_MUTATION = "getRequestStatisticsMutation",
  GET_CUSTOMERS_SCORE_MUTATION = "getCustomersScoreMutation",
  SYNC_KALAPA_SCORE_MUTATION = "syncKalapaScoreMutation",
  EXPORT_CUSTOMERS_SCORE_MUTATION = "exportCustomerScoreMutation",
}

export { Actions, Mutations };
