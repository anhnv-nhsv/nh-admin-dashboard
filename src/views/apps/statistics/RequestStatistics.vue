<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <el-input
              autofocus
              v-model="formSearchData.username"
              placeholder="Username"
              clearable
            />
          </div>
          <div
            class="col-md-6 d-flex align-items-center position-relative my-1"
          >
            <el-date-picker
              type="daterange"
              range-separator="-"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="DD/MM/YYYY"
              value-format="DD/MM/YYYY"
              v-model="formSearchData.dateRange"
            />
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <button
              :data-kt-indicator="loading ? 'on' : null"
              type="submit"
              class="btn btn-primary"
            >
              <span v-if="!loading" class="indicator-label">Search</span>
              <span v-if="loading" class="indicator-progress"
                >Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span
              ></span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="dataRequestStatistics"
        :pagination="pagination"
        :enable-items-per-page-dropdown="true"
        :loading="loading"
        :show-overflow-tooltip="true"
        @change-page="changePage"
        @change-page-size="changePageSize"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useReqStatistic } from "@/stores/req-statistic";
import moment from "moment/moment";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";

export default defineComponent({
  name: "request-statistics",
  components: {
    NHDatatable,
  },
  setup() {
    const store = useReqStatistic();
    const formSearchData = ref({
      username: "",
      dateRange: [
        moment().startOf("month").format("DD/MM/YYYY"),
        moment().format("DD/MM/YYYY"),
      ],
    });
    const tableHeader = ref([
      {
        label: "STT",
        prop: "seq",
        visible: true,
        width: 70,
      },
      {
        label: "Tên",
        prop: "clientUserName",
        visible: true,
      },
      {
        label: "IP",
        prop: "fromIP",
        visible: true,
      },
      {
        label: "NH API",
        prop: "apiUri",
        visible: true,
      },
      {
        label: "Status code",
        prop: "statusCode",
        visible: true,
      },
      {
        label: "Message",
        prop: "message",
        visible: true,
      },
      {
        label: "Kalapa API",
        prop: "thirtyServiceAPIURI",
        visible: true,
      },
      {
        label: "Thời gian phản hồi Kalapa (ms)",
        prop: "thirtyResponseTime",
        visible: true,
      },
    ]);
    const loading = ref<boolean>(false);
    let dataRequestStatistics = ref();
    let pagination = ref();

    async function getRequestStatistics(
      page?: number,
      username?: string,
      fromDate?: string,
      toDate?: string,
      pageSize = 10
    ) {
      console.log("call APsI");
      loading.value = true;
      await store.getReqStatistic({
        params: {
          username: username ? username : "",
          fromDate: fromDate
            ? fromDate
            : moment().startOf("month").format("DD/MM/YYYY"),
          toDate: toDate ? toDate : moment().format("DD/MM/YYYY"),
          page: page,
          pageSize: pageSize,
        },
      });
      const requestStatisticsResponse = JSON.parse(
        JSON.stringify(store.statisticResp)
      );
      dataRequestStatistics.value = requestStatisticsResponse.data;
      pagination.value = {
        totalPages: requestStatisticsResponse.totalPages,
        pageNo: requestStatisticsResponse.pageNo,
        pageSize: requestStatisticsResponse.pageSize,
        totalCount: requestStatisticsResponse.totalCount,
        currentCount: requestStatisticsResponse.currentCount,
      };
      loading.value = false;
    }

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestStatistics(
        1,
        formData.username,
        formData.dateRange ? formData.dateRange[0] : "",
        formData.dateRange ? formData.dateRange[1] : "",
        pagination.value.pageSize
      );
    }

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestStatistics(
        page,
        formData.username,
        formData.dateRange ? formData.dateRange[0] : "",
        formData.dateRange ? formData.dateRange[1] : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      console.log("changePageSize");
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getRequestStatistics(
        1,
        formData.username,
        formData.dateRange ? formData.dateRange[0] : "",
        formData.dateRange ? formData.dateRange[1] : "",
        pageSize
      );
    };

    onBeforeMount(() => {
      getRequestStatistics(1);
    });
    return {
      dataRequestStatistics,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      changePage,
      changePageSize,
      submitSearch,
    };
  },
});
</script>

<style scoped></style>
