<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <form
          class="form row w-100"
          autoComplete="on"
          @submit.prevent="submitSearch"
        >
          <div class="row wrapper-header">
            <div class="row">
              <div class="col d-flex align-items-center">
                <el-input
                  autofocus
                  v-model="formSearchData.username"
                  style=""
                  placeholder="Page"
                  clearable
                />
              </div>
              <div class="col d-flex align-items-center">
                <el-select
                  v-model="formSearchData.status"
                  clearable
                  placeholder="Status"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="col d-flex align-items-center">
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
            </div>
            <div class="col d-flex align-items-center justify-content-end">
              <el-button
                @click="visible = true"
                class="btn btn-primary btn-add"
              >
                Add
              </el-button>
              <el-dialog
                v-model="visible"
                title="Add Page"
                width="30%"
                align-center
              >
                <span>...</span>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="visible = false">Cancel</el-button>
                    <el-button type="primary" @click="visible = false">
                      Confirm
                    </el-button>
                  </span>
                </template>
              </el-dialog>
            </div>
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
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import { pageArray, options } from "./mock/index";
const value = ref("");
const visible = ref(false);

export default defineComponent({
  name: "page-management",
  components: {
    NHDatatable,
  },
  setup() {
    const store = useReqStatistic();
    const formSearchData = ref({
      username: "",
      status: "",
    });
    const tableHeader = ref([
      {
        label: "ID",
        prop: "seq",
        visible: true,
        width: 70,
      },
      {
        label: "Parent",
        prop: "clientUserName",
        visible: true,
      },
      {
        label: "Tên",
        prop: "fromIP",
        visible: true,
      },
      {
        label: "Hình ảnh",
        prop: "uriPage",
        visible: true,
      },
      {
        label: "Actions",
        prop: "action",
        visible: true,
      },
    ]);
    const loading = ref<boolean>(false);
    let dataRequestStatistics = ref();
    let pagination = ref();

    async function getRequestStatistics(
      page?: number,
      username?: string,
      status?: string,
      pageSize = 10
    ) {
      console.log("call APsI");
      loading.value = true;
      await store.getReqStatistic({
        params: {
          username: username ? username : "",
          status: status ? status : "",
          page: page,
          pageSize: pageSize,
        },
      });
      const requestStatisticsResponse = JSON.parse(
        JSON.stringify(store.statisticResp)
      );

      dataRequestStatistics.value = pageArray;
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
        formData.status ? formData.status : "",
        pagination.value.pageSize
      );
    }

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestStatistics(
        page,
        formData.username,
        formData.status ? formData.status : "",
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
        formData.status ? formData.status : "",
        pageSize
      );
    };

    onBeforeMount(() => {
      getRequestStatistics(1);
    });
    return {
      dataRequestStatistics,
      visible,
      options,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      value,
      changePage,
      changePageSize,
      submitSearch,
    };
  },
});
</script>

<style scoped>
.btn {
  padding: 6px 20px !important;
}

.card-title {
  width: 100%;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.dialog-footer button:first-child {
  margin-right: 0;
}
.btn-add {
  margin-left: -25px;
}
.wrapper-header {
  flex-flow: row;
}
</style>
