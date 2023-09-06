<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <button
          type="button"
          class="btn btn-light-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_test_editor"
        >
          Test
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="dataRequestStatistics"
        :pagination="pagination"
        :enable-items-per-page-dropdown="true"
        :user-role="userRole"
        :loading="loading"
        :show-overflow-tooltip="true"
        @change-page="changePage"
        @change-page-size="changePageSize"
        @single-select="handleSingleSelection"
        @multiple-select="handleMultipleSelection"
      >
        <template v-slot:indexColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            v-if="userRole === 'all'"
            type="selection"
            width="55"
          />
        </template>
        <template v-slot:action>
          <el-button>Edit</el-button>
          <el-popconfirm
            title="Are you sure to delete this?"
            icon-color="#626AEF"
            hide-after="10"
          >
            <template #reference>
              <el-button size="small" type="danger" class="del-btn"
                >Delete</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </NHDatatable>
    </div>
  </div>
  <TestEditorModal />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useReqStatistic } from "@/stores/req-statistic";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import { pageArray, options, selectTask } from "./mock/index";
import TestEditorModal from "@/components/editor/TestEditorModal.vue";
const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "page-management",
  components: {
    TestEditorModal,
    NHDatatable,
  },
  setup() {
    console.log("syncPayload: ", syncPayload);

    const store = useReqStatistic();
    const formSearchData = ref({
      username: "",
      status: "",
    });
    const data = ref({
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
        label: "Trạng thái",
        prop: "",
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
    let syncKLPBtn = ref<HTMLElement | null>(null);

    async function getRequestStatistics(
      page?: number,
      username?: string,
      status?: string,
      pageSize = 15
    ) {
      console.log("call API");
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

    const handleApplyStatus = () => {
      console.log(
        "handleApplyStatus: ",
        JSON.parse(JSON.stringify(data.value))
      );
    };

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestStatistics(
        1,
        formData.username,
        formData.status ? formData.status : "",
        pagination.value.pageSize
      );
    }
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
      console.log("syncPayload.value1: ", val);
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
      console.log("syncPayload.value2: ", syncPayload.value);
    };

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
      data,
      userRole,
      syncKLPBtn,
      visible,
      options,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      selectTask,
      syncPayload,
      value,
      handleApplyStatus,
      handleSingleSelection,
      handleMultipleSelection,
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

.del-btn {
  padding: 14px 15px;
}

.card-title {
  width: 100%;
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.action-right {
  flex: 1;
}

.search-page {
  flex-flow: row;
}

.dialog-footer button:first-child {
  margin-right: 0;
}
.btn-add {
  position: relative;
  left: 24px;
}
.wrapper-header {
  flex-flow: row;
}
</style>
