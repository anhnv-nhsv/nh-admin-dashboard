import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useReqStatistic = defineStore("req-statistic", () => {
  const statisticResp = ref([]);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setReqStatistic(data) {
    statisticResp.value = data;
  }

  function getReqStatistic(params) {
    return ApiService.query("/api/search-history", params)
      .then(({ data }) => {
        setReqStatistic(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  return {
    statisticResp,
    errors,
    getReqStatistic,
  };
});
