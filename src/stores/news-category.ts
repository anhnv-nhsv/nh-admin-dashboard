import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useNewsStore = defineStore("news-category-score", () => {
  const allNewCategoryResp = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setNewsCategoryRes(data) {
    allNewCategoryResp.value = data;
  }

  // Get All News
  function getAllNewsCategory(params?: any) {
    return ApiService.query("/news/get-all-cate-posts", params)
      .then(({ data }) => {
        setNewsCategoryRes(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  // Create News
  function createNewsCategory(val) {
    return ApiService.post("/news/create-cate-posts", val);
  }

  function editNewsCategory(val) {
    return ApiService.post("/news/update-cate-posts", val);
  }

  function deleteNewsCategory(id) {
    return ApiService.post("/news/delete-cate-posts", id);
  }

  function changeStatus(val) {
    return ApiService.post("/news/publish-cate-post", val);
  }

  function updateNewsOrderId(val) {
    return ApiService.post("/news/update-cate-order-id", val);
  }

  return {
    allNewCategoryResp,
    errors,
    getAllNewsCategory,
    deleteNewsCategory,
    createNewsCategory,
    editNewsCategory,
    updateNewsOrderId,
    changeStatus,
  };
});
