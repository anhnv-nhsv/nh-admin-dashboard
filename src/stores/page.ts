import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const usePageStore = defineStore("page-score", () => {
  const allPagesResp = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setPageRes(data) {
    allPagesResp.value = data;
  }

  // Get All Page
  function getAllPages(params?: any) {
    return ApiService.query("/pages/get-all-pages", params)
      .then(({ data }) => {
        // console.log("data: ", data);

        setPageRes(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  // Create Page
  function createPage(val) {
    return ApiService.post("/pages/create-page", val);
  }

  function editPage(val) {
    return ApiService.post("/pages/update-page", val);
  }

  function deletePage(id) {
    return ApiService.post("/pages/delete-page", id);
  }

  function changeStatus(val) {
    return ApiService.post("/pages/publish-page", val);
  }

  return {
    allPagesResp,
    errors,
    getAllPages,
    deletePage,
    createPage,
    editPage,
    changeStatus,
  };
});
