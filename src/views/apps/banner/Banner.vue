<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <form
          class="form row w-100"
          autoComplete="on"
          @submit.prevent="submitSearch"
        >
          <div class="col d-flex align-items-center justify-content-end mb-8">
            <router-link
              to="/apps/banner-management/create"
              class="btn btn-primary btn-add"
              >Add</router-link
            >
          </div>
          <div class="wrapper-header">
            <div class="row search-page">
              <div class="row">
                <div class="row col-9">
                  <div class="col-4">
                    <el-input
                      autofocus
                      v-model="formSearchData.username"
                      placeholder="Search Banner"
                      clearable
                    />
                  </div>
                  <div class="col-4">
                    <el-select
                      v-model="formSearchData.status"
                      clearable
                      placeholder="Status"
                    >
                      <el-option-group
                        v-for="group in options"
                        :key="group.label"
                        :label="group.label"
                      >
                        <el-option
                          v-for="item in group.options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-option-group>
                    </el-select>
                  </div>
                  <div class="col-4">
                    <button
                      :data-kt-indicator="loading ? 'on' : null"
                      type="submit"
                      class="btn btn-primary"
                    >
                      <span v-if="!loading" class="indicator-label"
                        >Search</span
                      >
                      <span v-if="loading" class="indicator-progress"
                        >Please wait...
                        <span
                          class="spinner-border spinner-border-sm align-middle ms-2"
                        ></span
                      ></span>
                    </button>
                  </div>
                </div>
                <div class="row col-3 action-right">
                  <div class="col-10">
                    <el-select
                      v-model="data.status"
                      :disabled="!syncPayload.length"
                      clearable
                      placeholder="Chọn tác vụ"
                    >
                      <el-option
                        v-for="item in selectTask"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                  <div class="col-2">
                    <button
                      :data-kt-indicator="loading ? 'on' : null"
                      @click="handleApplyStatus"
                      ref="syncKLPBtn"
                      disabled
                      class="btn btn-primary"
                    >
                      <span v-if="!loading" class="indicator-label">Apply</span>
                      <span v-if="loading" class="indicator-progress"
                        >Please wait...
                        <span
                          class="spinner-border spinner-border-sm align-middle ms-2"
                        ></span
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
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
        <template v-slot:uriPage="{ row }">
          <img :src="row.uriPage" :alt="row.namePost" class="table-img" />
        </template>
        <template v-slot:url="{ row }">
          <a :href="row.url" target="_blank">{{ row.url }}</a>
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
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useReqStatistic } from "@/stores/req-statistic";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import { contactArray, options, selectTask } from "./mock/index";
const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "banner-management",
  components: {
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
        label: "Tên",
        prop: "namePost",
        visible: true,
      },
      {
        label: "Hình ảnh",
        prop: "uriPage",
        visible: true,
      },
      {
        label: "URL",
        prop: "url",
        visible: true,
      },
      {
        label: "Trạng thái",
        width: 140,
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

      dataRequestStatistics.value = contactArray;
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
.table-img {
  width: 100%;
  border-radius: 8px;
  position: relative;
  object-fit: contain;
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
