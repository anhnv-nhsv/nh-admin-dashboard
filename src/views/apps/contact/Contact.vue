<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div>
            <el-input
              autofocus
              size="large"
              placeholder="Press enter to search"
              clearable
              :prefix-icon="Search"
            />
          </div>
        </form>
      </div>
      <div class="card-toolbar">
        <div
          v-if="selectedIds === 0"
          class="d-flex justify-content-end"
          data-kt-customer-table-toolbar="base"
        >
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_news_category_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Category
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteCategory()"
          >
            Delete Selected
          </button>
        </div>
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-customer-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-customer-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
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
            type="selection"
            width="55"
          />
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            label="Thao tác"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="default"
                data-bs-toggle="modal"
                data-bs-target="#kt_news_category_modal"
                @click.prevent="editCategory(scope.row)"
              >
                Edit
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteCategory(scope.row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <ContactManagementModal :action="newsAction" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useReqStatistic } from "@/stores/req-statistic";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import { contactArray, options, selectTask } from "./mock/index";
import ContactManagementModal from "@/components/modals/forms/ContactManagementModal.vue";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "contact-management",
  components: {
    ContactManagementModal,
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
        label: "Tên người dùng",
        prop: "clientUserName",
        visible: true,
      },
      {
        label: "Email",
        prop: "clientEmail",
        visible: true,
      },
      {
        label: "Nội dung",
        prop: "fromIP",
        visible: true,
      },
      {
        label: "Thời gian",
        prop: "contactTime",
        visible: true,
      },
      {
        label: "Trạng thái",
        width: 90,
        prop: "",
        visible: true,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestStatistics = ref();
    let newsAction = ref("");
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
      selectedIds.value += 1;
      console.log(`handleSingleSelection: ${val}`);
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
      console.log(`handleMultipleSelection: ${val}`);
    };

    const addCategory = () => {
      newsAction.value = "add";
      console.log("add category");
    };

    const editCategory = (val?: object | undefined) => {
      newsAction.value = "edit";
      console.log("edit category: ", val);
    };

    const deleteCategory = (val?: object | undefined) => {
      console.log(val);
      console.log("delete category");
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
      selectedIds,
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
      newsAction,
      Search,
      handleApplyStatus,
      addCategory,
      editCategory,
      deleteCategory,
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
