import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useNewsListStore = defineStore("news-list-score", () => {
  const allNewListResp = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setNewsListRes(data) {
    allNewListResp.value = data;
  }

  // Get All News
  function getAllNewsList(params?: any) {
    return ApiService.query("/news/get-all-new-posts", params)
      .then(({ data }) => {
        setNewsListRes(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  // Create News
  function createNewsList(val) {
    return ApiService.post("/news/create-new", val);
  }

  function editNewsList(val) {
    return ApiService.post("/news/update-new", val);
  }

  function deleteNewsList(id) {
    return ApiService.post("/news/delete-new", id);
  }

  function changeStatus(val) {
    return ApiService.post("/news/publish-new", val);
  }

  return {
    allNewListResp,
    errors,
    getAllNewsList,
    deleteNewsList,
    createNewsList,
    editNewsList,
    changeStatus,
  };
});
