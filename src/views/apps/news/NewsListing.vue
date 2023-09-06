<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title flex-column">
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
      <NhDatatable
        :table-header="tableHeader"
        :table-data="tableData"
        userRole="all"
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
      </NhDatatable>
    </div>
  </div>
  <NewsCategoryModal :action="newsAction" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NhDatatable from "@/components/nh-datatable/NHDatatable.vue";
import NewsCategoryModal from "@/components/modals/forms/NewsCategoryModal.vue";

export default defineComponent({
  name: "news-listing",
  components: { NewsCategoryModal, NhDatatable },
  setup() {
    const tableHeader = [
      { label: "Date", prop: "date", visible: true },
      { label: "Name", prop: "name", visible: true },
      { label: "Address", prop: "address", visible: true },
    ];
    const tableData = [
      {
        id: 1,
        date: "2016-05-02",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        id: 2,
        date: "2016-05-04",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
      },
      {
        id: 3,
        date: "2016-05-01",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
        children: [
          {
            id: 31,
            date: "2016-05-01",
            name: "wangxiaohu",
            address: "No. 189, Grove St, Los Angeles",
          },
          {
            id: 32,
            date: "2016-05-01",
            name: "wangxiaohu",
            address: "No. 189, Grove St, Los Angeles",
          },
        ],
      },
      {
        id: 4,
        date: "2016-05-03",
        name: "wangxiaohu",
        address: "No. 189, Grove St, Los Angeles",
      },
    ];
    let selectedIds = ref(0);
    let newsAction = ref("");

    const submitSearch = () => {
      console.log("submit search news category");
    };

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
      console.log("edit category");
    };

    const deleteCategory = (val?: object | undefined) => {
      console.log(val);
      console.log("delete category");
    };

    return {
      tableHeader,
      tableData,
      selectedIds,
      newsAction,
      Search,
      submitSearch,
      handleSingleSelection,
      handleMultipleSelection,
      addCategory,
      editCategory,
      deleteCategory,
    };
  },
});
</script>

<style scoped></style>
