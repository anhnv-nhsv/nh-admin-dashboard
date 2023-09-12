<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-6 d-flex align-items-center position-relative my-1"
          >
            <el-input
              autofocus
              v-model="formSearchData.name"
              size="large"
              placeholder="Press enter to search"
              clearable
              :prefix-icon="Search"
              @submit.prevent="submitSearch"
            />
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <el-select
              placeholder="Status"
              size="large"
              v-model="formSearchData.publish"
            >
              <el-option label="All" />
              <el-option label="Enable" value="1" />
              <el-option label="Disable" value="0" />
            </el-select>
          </div>
          <div
            class="col-md-3 d-flex align-items-center position-relative my-1"
          >
            <button
              :data-kt-indicator="false ? 'on' : null"
              type="submit"
              class="btn btn-primary"
            >
              <span v-if="true" class="indicator-label">Search</span>
              <span v-if="false" class="indicator-progress"
                >Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span
              ></span>
            </button>
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
            data-bs-target="#kt_news_modal"
            @click="addCategory"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add News
          </button>
        </div>
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-customer-table-toolbar="selected"
        >
          <div class="w-auto">
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteMutiRow()"
            >
              Delete {{ selectedIds }} selected
            </button>
          </div>
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
        ref="myTable"
        :table-header="tableHeader"
        :table-data="dataRequestNewsListManager"
        :pagination="pagination"
        :enable-items-per-page-dropdown="true"
        userRole="all"
        :loading="loading"
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
        <template v-slot:name="{ row }">
          <div class="left-name">{{ row.name }}</div>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            label="Operation"
          >
            <template #default="scope">
              <div class="change-status">
                <el-button
                  size="small"
                  type="default"
                  data-bs-toggle="modal"
                  data-bs-target="#kt_news_modal"
                  @click.prevent="editCategory(scope.row)"
                >
                  Edit
                </el-button>
                <el-popconfirm
                  title="Are you sure to delete this?"
                  icon-color="#626AEF"
                  hide-after="10"
                  @confirm="deleteCategory(scope.row)"
                >
                  <template #reference>
                    <el-button size="small" type="danger">Delete</el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  size="small"
                  type="default"
                  @click.prevent="handleChangeStatus(scope.row)"
                >
                  Change status
                </el-button>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- <template v-slot:category_name>
          <div v-for="item of nameCate" :key="item.id">{{ item.name }}</div>
        </template> -->
        <template v-slot:time_post="{ row }">
          <div v-if="row.time_post">
            {{ formatDate(row.time_post) }}
          </div>
          <div v-if="row.time_post === undefined">-</div>
        </template>
        <template v-slot:publish="{ row }">
          <span v-if="row.publish === 1">
            <i class="bi bi-check-circle-fill text-success"></i
          ></span>
          <span v-if="row.publish !== 1"
            ><i class="bi bi-x-circle-fill text-danger"></i
          ></span>
        </template>
      </NHDatatable>
    </div>
  </div>
  <NewsModal
    :action="newsAction"
    :rowDetail="rowDetail"
    @submitSearch="submitSearch"
    :abc="abc"
    :nameCate="nameCate"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useNewsListStore } from "@/stores/news-list";
import { useNewsStore } from "@/stores/news-category";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import NewsModal from "@/components/modals/forms/NewsModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "news-listing",
  components: {
    NewsModal,
    NHDatatable,
  },
  setup() {
    const store = useNewsListStore();
    const storeCate = useNewsStore();
    const formSearchData = ref({
      name: "",
      publish: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: " Post Name",
        prop: "name",
        visible: true,
      },
      {
        label: "Category Name",
        prop: "category_name",
        visible: true,
        width: 240,
      },
      {
        label: "Posting Time",
        prop: "time_post",
        visible: true,
        width: 150,
      },
      {
        label: "Status",
        prop: "publish",
        visible: true,
        width: 120,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestNewsListManager = ref();
    let newsAction = ref("");
    let pagination = ref();
    let rowDetail = ref();
    let abc = ref();
    let nameCate = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    async function getRequestPageManager(
      pageNo?: number,
      name?: string,
      publish?: string,
      pageSize = "10"
    ) {
      loading.value = true;
      await store.getAllNewsList({
        params: {
          name: name ? name : "",
          publish: publish ? publish : "",
          pageNo: pageNo,
          pageSize: pageSize,
        },
      });

      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      dataRequestNewsListManager.value = requestNewsListResponse.data;
      pagination.value = {
        totalPages: requestNewsListResponse.totalPages,
        pageNo: requestNewsListResponse.pageNo,
        pageSize: requestNewsListResponse.pageSize,
        totalCount: requestNewsListResponse.totalCount,
        currentCount: requestNewsListResponse.currentCount,
      };
      loading.value = false;
    }

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestPageManager(
        1,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }
    const handleSingleSelection = (val) => {
      selectedIds.value += 1;
      console.log(`handleSingleSelection: ${val}`);
    };

    const handleMultipleSelection = (val) => {
      selectedIds.value = val.length;
      rowCheck.value = JSON.parse(JSON.stringify(val));
    };

    const addCategory = async () => {
      newsAction.value = "add";
      rowDetail.value = {};
      await store.getAllNewsList({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      abc.value = requestNewsListResponse;
    };

    const editCategory = async (val?: object | undefined) => {
      newsAction.value = "edit";
      rowDetail.value = JSON.parse(JSON.stringify(val));
      await store.getAllNewsList({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsListResponse = JSON.parse(
        JSON.stringify(store.allNewListResp)
      );

      abc.value = requestNewsListResponse;
    };

    const deleteCategory = async (val?: any) => {
      const oke = await store.deleteNewsList({ id: val.id });
      if (oke.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success!",
          showConfirmButton: false,
          timer: 1500,
        });
        submitSearch();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: oke.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const deleteMutiRow = async () => {
      let arr: any = [];
      const change = JSON.parse(JSON.stringify(rowCheck.value));
      for (const item of change) {
        arr.push(item.id);
      }

      const oke = await store.deleteNewsList({
        id: arr,
      });
      if (oke.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success!",
          showConfirmButton: false,
          timer: 1500,
        });
        submitSearch();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: oke.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    const handleChangeStatus = async (val?: any) => {
      console.log(JSON.parse(JSON.stringify(val)));
      const Tpublish = JSON.parse(JSON.stringify(val));
      const result = Tpublish.publish === 0 ? 1 : 0;
      const oke = await store.changeStatus({ id: val.id, publish: result });
      if (oke.data.success === true) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Success!",
          showConfirmButton: false,
          timer: 1500,
        });
        submitSearch();
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: oke.data.mess,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    function changePage(page) {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestPageManager(
        page,
        formData.name,
        formData.publish ? formData.publish : "",
        pagination.value.pageSize
      );
    }

    const changePageSize = (pageSize) => {
      console.log("changePageSize");
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      pagination.value.pageSize = pageSize;
      getRequestPageManager(
        1,
        formData.name,
        formData.publish ? formData.publish : "",
        pageSize
      );
    };

    onMounted(() => {
      async function getRequestNewsCategoryManager(
        pageNo?: number,
        name?: string,
        publish?: string,
        pageSize = "1000"
      ) {
        loading.value = true;
        await storeCate.getAllNewsCategory({
          params: {
            name: name ? name : "",
            publish: publish ? publish : "",
            pageNo: pageNo,
            pageSize: pageSize,
          },
        });

        const requestNewsCategoryResponse = JSON.parse(
          JSON.stringify(storeCate.allNewCategoryResp)
        );

        nameCate.value = requestNewsCategoryResponse.data;

        loading.value = false;
      }

      getRequestNewsCategoryManager();
    });

    const formatDate = (val) => {
      if (val) {
        const dateObject = new Date(val);
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to month because months are zero-indexed
        const day = dateObject.getDate().toString().padStart(2, "0");

        return year + "-" + month + "-" + day;
      } else {
        return "-";
      }
    };

    onBeforeMount(() => {
      getRequestPageManager(1);
    });
    return {
      dataRequestNewsListManager,
      nameCate,
      data,
      selectedIds,
      userRole,
      syncKLPBtn,
      visible,
      tableHeader,
      pagination,
      loading,
      formSearchData,
      syncPayload,
      value,
      newsAction,
      rowDetail,
      Search,
      abc,
      addCategory,
      formatDate,
      editCategory,
      deleteCategory,
      deleteMutiRow,
      handleChangeStatus,
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

.my-header {
  display: flex;
  justify-content: space-between;
}

.left-name {
  text-align: left;
}

.action-right {
  flex: 1;
}

.search-page {
  flex-flow: row;
}

.change-status {
  display: flex;
  align-items: center;
  justify-content: center;
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
