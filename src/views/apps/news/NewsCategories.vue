<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column">
        <form class="form row" autoComplete="on" @submit.prevent="submitSearch">
          <div
            class="col-md-6 d-flex align-items-center position-relative my-1"
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
            class="col-md-6 d-flex align-items-center position-relative my-1"
          >
            <button
              :data-kt-indicator="false ? 'on' : null"
              type="submit"
              class="btn btn-primary"
            >
              <span v-if="true" class="indicator-label">Apply</span>
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
        :table-data="dataRequestNewsCategoryManager"
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
  <NewsCategoryModal
    :action="newsAction"
    :rowDetail="rowDetail"
    @submitSearch="submitSearch"
    :abc="abc"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { useNewsStore } from "@/stores/news-category";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import NewsCategoryModal from "@/components/modals/forms/NewsCategoryModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";

const value = ref("");
const visible = ref(false);
let userRole = ref("all");
let syncPayload = ref<any[]>([]);

export default defineComponent({
  name: "news-category",
  components: {
    NewsCategoryModal,
    NHDatatable,
  },
  setup() {
    const store = useNewsStore();
    const formSearchData = ref({
      name: "",
      publish: "",
    });
    const data = ref({
      publish: "",
    });
    const tableHeader = ref([
      {
        label: "Category Name",
        prop: "name",
        visible: true,
      },
      {
        label: "Status",
        prop: "publish",
        visible: true,
        width: 220,
      },
    ]);
    let selectedIds = ref(0);
    const loading = ref<boolean>(false);
    let dataRequestNewsCategoryManager = ref();
    let newsAction = ref("");
    let pagination = ref();
    let rowDetail = ref();
    let abc = ref();
    let syncKLPBtn = ref<HTMLElement | null>(null);
    const rowCheck = ref([]);

    async function getRequestNewsCategoryManager(
      pageNo?: number,
      name?: string,
      publish?: string,
      pageSize = "10"
    ) {
      loading.value = true;
      await store.getAllNewsCategory({
        params: {
          name: name ? name : "",
          publish: publish ? publish : "",
          pageNo: pageNo,
          pageSize: pageSize,
        },
      });

      const requestNewsCategoryResponse = JSON.parse(
        JSON.stringify(store.allNewCategoryResp)
      );

      dataRequestNewsCategoryManager.value = requestNewsCategoryResponse.data;
      pagination.value = {
        totalPages: requestNewsCategoryResponse.totalPages,
        pageNo: requestNewsCategoryResponse.pageNo,
        pageSize: requestNewsCategoryResponse.pageSize,
        totalCount: requestNewsCategoryResponse.totalCount,
        currentCount: requestNewsCategoryResponse.currentCount,
      };
      loading.value = false;
    }

    function submitSearch() {
      const formData = JSON.parse(JSON.stringify(formSearchData.value));
      getRequestNewsCategoryManager(
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
      await store.getAllNewsCategory({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsCategoryResponse = JSON.parse(
        JSON.stringify(store.allNewCategoryResp)
      );

      abc.value = requestNewsCategoryResponse;
    };

    const editCategory = async (val?: object | undefined) => {
      newsAction.value = "edit";
      rowDetail.value = JSON.parse(JSON.stringify(val));
      await store.getAllNewsCategory({
        params: {
          name: "",
          publish: "",
          pageNo: 1,
          pageSize: 1000,
        },
      });
      const requestNewsCategoryResponse = JSON.parse(
        JSON.stringify(store.allNewCategoryResp)
      );

      abc.value = requestNewsCategoryResponse;
    };

    const deleteCategory = (val?: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await store.deleteNewsCategory({ id: val.id });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
              showConfirmButton: false,
              timer: 1000,
            });
            submitSearch();
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      });
    };

    const deleteMutiRow = async () => {
      let arr: any = [];
      const change = JSON.parse(JSON.stringify(rowCheck.value));
      for (const item of change) {
        arr.push(item.id);
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await store.deleteNewsCategory({ id: arr });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
              showConfirmButton: false,
              timer: 1000,
            });
            submitSearch();
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: response.data.mess,
              showConfirmButton: false,
              timer: 1000,
            });
          }
        }
      });
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
      getRequestNewsCategoryManager(
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
      getRequestNewsCategoryManager(
        1,
        formData.name,
        formData.publish ? formData.publish : "",
        pageSize
      );
    };

    onBeforeMount(() => {
      getRequestNewsCategoryManager(1);
    });
    return {
      dataRequestNewsCategoryManager,
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
  flex-direction: row;
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
