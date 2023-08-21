import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const useCustomerStore = defineStore("customer-score", () => {
  const customersScoreResp = ref([]);
  const syncKalapaStatusCode = ref(-1);
  const exportedCustomerResp = ref(-1);
  const errors = ref({});

  function setError(error: any) {
    errors.value = { ...error };
  }

  function setCustomersScore(data) {
    customersScoreResp.value = data;
  }

  function setSyncKalapaStatus(status) {
    syncKalapaStatusCode.value = status;
  }

  function setExportedResult(data) {
    exportedCustomerResp.value = data;
  }

  function getCustomersScore(params) {
    return ApiService.query("/api/account-info", params)
      .then(({ data }) => {
        setCustomersScore(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function syncKalapaScore(params) {
    return ApiService.post("/api/account-info/sync-kalapa", params)
      .then(({ status }) => {
        setSyncKalapaStatus(status);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function exportCustomersScore(params) {
    return ApiService.query("/api/account-info/export/excel", params)
      .then((response) => {
        setExportedResult(response);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  return {
    customersScoreResp,
    syncKalapaStatusCode,
    exportedCustomerResp,
    errors,
    getCustomersScore,
    syncKalapaScore,
    exportCustomersScore,
  };
});
