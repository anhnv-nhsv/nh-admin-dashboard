import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useUserMgmt = defineStore("user-mgmt", () => {
  const userList = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setUserList(data) {
    userList.value = data;
  }

  function getUserList(params) {
    return ApiService.query("/users/get-all-users", params)
      .then(({ data }) => {
        setUserList(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function createUser(val) {
    return ApiService.post("/users/create-user", val);
  }

  function deleteUser(id) {
    return ApiService.post("/users/delete-user", id);
  }

  function updateUser(val) {
    return ApiService.post("/users/update-role-user", val);
  }

  return {
    userList,
    errors,
    getUserList,
    createUser,
    deleteUser,
    updateUser,
  };
});
