import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useMenu = defineStore("menu", () => {
  const menuList = ref([]);
  const menuDetailList = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setMenuList(data) {
    menuList.value = data;
  }
  function setMenuDetailList(data) {
    menuDetailList.value = data;
  }

  function getAllMenu(params?: string) {
    return ApiService.query("/menus/get-all-menus", params)
      .then(({ data }) => {
        setMenuList(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function getDetailMenu(params?: any) {
    return ApiService.query("/menus/get-all-item-menus?", params)
      .then(({ data }) => {
        setMenuDetailList(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function updateItemMenu(val) {
    return ApiService.post("/menus/update-item-menus", val);
  }

  function createMenu(val) {
    return ApiService.post("/menus/create-menu", val);
  }

  function createMenuItem(val) {
    return ApiService.post("/menus/create-item-menu", val);
  }

  return {
    menuList,
    menuDetailList,
    errors,
    getAllMenu,
    getDetailMenu,
    updateItemMenu,
    createMenu,
    createMenuItem,
  };
});
