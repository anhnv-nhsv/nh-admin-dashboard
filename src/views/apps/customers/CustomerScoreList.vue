<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title flex-column">
        <div class="row">
          <div class="d-flex">
            <div class="w-auto me-5">
              <button
                type="button"
                class="btn btn-primary btn-active-light-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-start"
                data-kt-menu-flip="top-start"
                data-kt-menu-attach="parent"
              >
                <span class="svg-icon svg-icon-2">
                  <inline-svg src="media/icons/duotune/general/gen021.svg" />
                </span>
                Search
              </button>
              <SearchCustomerDropdown @search="searchCustomerScore" />
            </div>
            <div class="w-auto me-5">
              <button
                type="button"
                class="btn btn-primary"
                disabled
                ref="syncKLPBtn"
                @click.prevent="changeSyncType('selection')"
                data-bs-toggle="modal"
                data-bs-target="#kt_modal_sync_kalapa_data"
              >
                <span class="svg-icon svg-icon-2">
                  <inline-svg src="media/icons/duotune/coding/cod007.svg" />
                </span>
                Sync selected
              </button>
            </div>
            <div v-if="userRole === 'all'" class="w-auto me-5">
              <button
                type="button"
                class="btn btn-icon btn-color-primary btn-active-light-primary"
                @click.prevent="changeSyncType('all')"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-start"
                data-kt-menu-flip="top-start"
                data-kt-menu-attach="parent"
              >
                <span class="svg-icon svg-icon-2">
                  <inline-svg src="media/icons/duotune/general/gen053.svg" />
                </span>
              </button>
              <AdvancedActionDropdown :search-payload="formSearch" />
            </div>
          </div>
        </div>
      </div>
      <div class="card-toolbar">
        <div>
          <button
            type="button"
            class="btn btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
            data-kt-menu-attach="parent"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/general/gen031.svg" />
            </span>
          </button>
          <ColumnVisibilityDropdown
            @selection-change="handleColumnsVisibility"
          />
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader2"
        :table-data="customerScoreData"
        :pagination="pagination"
        :user-role="userRole"
        :enable-items-per-page-dropdown="true"
        :loading="loading"
        @change-page="changePage"
        @change-page-size="changePageSize"
        @single-select="handleSingleSelection"
        @multiple-select="handleMultipleSelection"
      />
    </div>
  </div>

  <SyncKalapaModal :sync-payload="syncPayload" :sync-type="syncType" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useCustomerStore } from "@/stores/customer-score";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import SyncKalapaModal from "@/components/customers/modal/SyncKalapaModal.vue";
import ColumnVisibilityDropdown from "@/components/customers/dropdown/ColumnVisibilityDropdown.vue";
import SearchCustomerDropdown from "@/components/customers/dropdown/SearchCustomerDropdown.vue";
import AdvancedActionDropdown from "@/components/customers/dropdown/AdvancedActionDropdown.vue";

export default defineComponent({
  name: "customer-score-list",
  components: {
    ColumnVisibilityDropdown,
    SearchCustomerDropdown,
    AdvancedActionDropdown,
    SyncKalapaModal,
    NHDatatable,
  },
  setup() {
    const store = useCustomerStore();
    const formSearch = ref({
      idNo: "",
      tel: "",
      name: "",
      acctNo: "",
      userScore: "",
      blacklist: "",
      dateRange: [],
    });
    const tableHeader2 = ref([
      { label: "STT", prop: "seq", visible: true, width: 70 },
      { label: "Số ID của KH", prop: "idno", visible: true },
      { label: "Số điện thoại của KH", prop: "tel", visible: true },
      { label: "Tên khách hàng", prop: "custNM", visible: true, width: 150 },
      {
        label: "USER SCORE",
        visible: false,
        children: [
          { label: "Score", prop: "userScore.score" },
          { label: "Mô tả kết quả", prop: "cnte", width: 300 },
          { label: "Name similar score", prop: "userScore.nameSimilarScore" },
          { label: "Phone similar score", prop: "userScore.phoneMatched" },
        ],
      },
      {
        label: "BLACKLIST",
        visible: false,
        children: [
          { label: "FI", prop: "blacklist.fi" },
          { label: "PDL", prop: "blacklist.pdl" },
        ],
      },
      {
        label: "CREDIT SCORE",
        visible: false,
        children: [
          {
            label: "E-wallet, Buy now pay later",
            prop: "creditScore.creditScore1",
          },
          { label: "Bank & FI", prop: "creditScore.creditScore2" },
          {
            label: "Microlending (Short-term loan app)",
            prop: "creditScore.creditScore3",
          },
        ],
      },
      {
        label: "JOB SCORE",
        visible: false,
        children: [
          { label: "Score 1", prop: "jobScore.job1Score" },
          { label: "Tên Công ty của KH 1", prop: "jobScore.job1Nm" },
          { label: "Mã số thuế của Công ty 1", prop: "jobScore.job1TaxCd" },
          { label: "Start date 1", prop: "jobScore.job1StrtDt" },
          { label: "End date 1", prop: "jobScore.job1EndDt" },
          { label: "Score 2", prop: "jobScore.job2Score" },
          { label: "Tên Công ty của KH 2", prop: "jobScore.job2Nm" },
          { label: "Mã số thuế của Công ty 2", prop: "jobScore.job2TaxCd" },
          { label: "Start date 2", prop: "jobScore.job2StrtDt" },
          { label: "End date 2", prop: "jobScore.job2EndDt" },
          { label: "Score 3", prop: "jobScore.job3Score" },
          { label: "Tên Công ty của KH 3", prop: "jobScore.job3Nm" },
          { label: "Mã số thuế của Công ty 3", prop: "jobScore.job3TaxCd" },
          { label: "Start date 3", prop: "jobScore.job3StrtDt" },
          { label: "End date 3", prop: "jobScore.job3EndDt" },
        ],
      },
      { label: "Số Tài khoản GDCK", visible: true, prop: "acntNo" },
      { label: "Người xử lý", visible: true, prop: "procNm" },
      { label: "Ngày xử lý", visible: true, prop: "procDt" },
      { label: "Kalapa data application", visible: true, prop: "kalapaAppDat" },
    ]);
    const loading = ref(false);
    let customerScoreData = ref();
    let pagination = ref();
    let userRole = ref("all");
    let syncKLPBtn = ref<HTMLElement | null>(null);
    let syncPayload = ref<any[]>([]);
    let syncType = ref("");

    async function getCustomersScore(
      page?: number,
      idNo?: string,
      tel?: string,
      name?: string,
      accountNo?: string,
      fromDate?: string,
      toDate?: string,
      startScore?: string,
      endScore?: string,
      blacklist?: string,
      pageSize = 10,
      updateFlag = "N"
    ) {
      console.log(`call API`);
      loading.value = true;
      await store.getCustomersScore({
        params: {
          idNo: idNo ? idNo : "",
          tel: tel ? tel : "",
          name: name ? name : "",
          accountNo: accountNo ? accountNo : "",
          fromDate: fromDate ? fromDate : "",
          toDate: toDate ? toDate : "",
          startScore: startScore ? startScore : "",
          endScore: endScore ? endScore : "",
          blacklist: blacklist ? blacklist : "",
          updateFlag: updateFlag ? updateFlag : "N",
          page: page,
          pageSize: pageSize,
        },
      });
      const customersScoreResp = JSON.parse(
        JSON.stringify(store.customersScoreResp)
      );
      customerScoreData.value = customersScoreResp.data;
      pagination.value = {
        totalPages: customersScoreResp.totalPages,
        pageNo: customersScoreResp.pageNo,
        pageSize: customersScoreResp.pageSize,
        totalCount: customersScoreResp.totalCount,
        currentCount: customersScoreResp.currentCount,
      };
      loading.value = false;
    }

    const searchCustomerScore = (formData) => {
      console.log("searchCustomerScore");
      formSearch.value = formData;
      const formDataRaw = JSON.parse(JSON.stringify(formData));
      getCustomersScore(
        1,
        formDataRaw.idNo,
        formDataRaw.tel,
        formDataRaw.name,
        formDataRaw.acctNo,
        formDataRaw.dateRange[0],
        formDataRaw.dateRange[1],
        formDataRaw.userScore.split("-")[0],
        formDataRaw.userScore.split("-")[1],
        formDataRaw.blacklist,
        pagination.value.pageSize
      );
    };

    const changePage = (page) => {
      console.log("changePage");
      const formDataRaw = JSON.parse(JSON.stringify(formSearch.value));
      getCustomersScore(
        page,
        formDataRaw.idNo,
        formDataRaw.tel,
        formDataRaw.name,
        formDataRaw.acctNo,
        formDataRaw.dateRange[0],
        formDataRaw.dateRange[1],
        formDataRaw.userScore.split("-")[0],
        formDataRaw.userScore.split("-")[1],
        formDataRaw.blacklist,
        pagination.value.pageSize
      );
    };

    const changePageSize = (pageSize) => {
      console.log("changePageSize");
      const formDataRaw = JSON.parse(JSON.stringify(formSearch.value));
      pagination.value.pageSize = pageSize;
      getCustomersScore(
        1,
        formDataRaw.idNo,
        formDataRaw.tel,
        formDataRaw.name,
        formDataRaw.acctNo,
        formDataRaw.dateRange[0],
        formDataRaw.dateRange[1],
        formDataRaw.userScore.split("-")[0],
        formDataRaw.userScore.split("-")[1],
        formDataRaw.blacklist,
        pageSize
      );
    };

    onBeforeMount(() => {
      getCustomersScore(1);
    });

    const handleSingleSelection = (val) => {
      if (!syncKLPBtn.value) {
        return;
      }
      if (val) {
        syncKLPBtn.value.removeAttribute("disabled");
      } else {
        syncKLPBtn.value?.setAttribute("disabled", "");
      }
      syncPayload.value = [val];
    };

    const handleMultipleSelection = (val) => {
      if (!syncKLPBtn.value) {
        return;
      }
      if (val.length > 0) {
        syncKLPBtn.value.removeAttribute("disabled");
      } else {
        syncKLPBtn.value?.setAttribute("disabled", "");
      }
      syncPayload.value = val;
    };

    const handleColumnsVisibility = (val) => {
      const selectedCols = JSON.parse(JSON.stringify(val));
      tableHeader2.value[
        tableHeader2.value.findIndex((e) => e.label == "USER SCORE")
      ].visible = false;
      tableHeader2.value[
        tableHeader2.value.findIndex((e) => e.label == "BLACKLIST")
      ].visible = false;
      tableHeader2.value[
        tableHeader2.value.findIndex((e) => e.label == "CREDIT SCORE")
      ].visible = false;
      tableHeader2.value[
        tableHeader2.value.findIndex((e) => e.label == "JOB SCORE")
      ].visible = false;
      for (const selectedCol of selectedCols) {
        if (selectedCol.key == "user-score") {
          tableHeader2.value[
            tableHeader2.value.findIndex((e) => e.label == "USER SCORE")
          ].visible = true;
        }
        if (selectedCol.key == "blacklist") {
          tableHeader2.value[
            tableHeader2.value.findIndex((e) => e.label == "BLACKLIST")
          ].visible = true;
        }
        if (selectedCol.key == "credit-score") {
          tableHeader2.value[
            tableHeader2.value.findIndex((e) => e.label == "CREDIT SCORE")
          ].visible = true;
        }
        if (selectedCol.key == "job-score") {
          tableHeader2.value[
            tableHeader2.value.findIndex((e) => e.label == "JOB SCORE")
          ].visible = true;
        }
      }
    };

    const changeSyncType = (val) => {
      syncType.value = val;
    };

    return {
      tableHeader2,
      customerScoreData,
      loading,
      pagination,
      syncKLPBtn,
      syncPayload,
      syncType,
      userRole,
      formSearch,
      changePage,
      changePageSize,
      searchCustomerScore,
      handleSingleSelection,
      handleMultipleSelection,
      handleColumnsVisibility,
      changeSyncType,
    };
  },
});
</script>

<style scoped></style>
