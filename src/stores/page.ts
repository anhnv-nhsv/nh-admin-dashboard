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

  function getAllPages(params) {
    return ApiService.query("/pages/get-all-pages", params)
      .then(({ data }) => {
        setPageRes(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  return {
    allPagesResp,
    errors,
    getAllPages,
  };
});
