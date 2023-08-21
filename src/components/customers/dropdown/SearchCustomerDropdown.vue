<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-550px" data-kt-menu="true">
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bolder">Search customers</div>
    </div>
    <div class="separator border-gray-200"></div>
    <!--begin::Form-->
    <div class="px-7 py-5">
      <el-form :model="formSearch">
        <div class="row d-flex">
          <el-form-item class="w-50">
            <el-input v-model="formSearch.idNo" placeholder="Identity number" />
          </el-form-item>
          <el-form-item class="w-50">
            <el-input v-model="formSearch.tel" placeholder="Phone" />
          </el-form-item>
        </div>
        <div class="row d-flex">
          <el-form-item class="w-50">
            <el-input v-model="formSearch.name" placeholder="Customer name" />
          </el-form-item>
          <el-form-item class="w-50">
            <el-input
              v-model="formSearch.acctNo"
              placeholder="Account number"
            />
          </el-form-item>
        </div>
        <div class="row d-flex">
          <el-form-item class="w-100">
            <el-date-picker
              type="daterange"
              range-separator="-"
              start-placeholder="Start date"
              end-placeholder="End date"
              format="DD/MM/YYYY"
              value-format="YYYYMMDD"
              v-model="formSearch.dateRange"
              :teleported="false"
            />
          </el-form-item>
        </div>
        <div class="row d-flex">
          <el-form-item class="w-50">
            <el-select
              v-model="formSearch.userScore"
              placeholder="User score"
              clearable
            >
              <el-option label="801 - 850" value="801-850" />
              <el-option label="600 - 800" value="600-800" />
              <el-option label="500 - 599" value="500-599" />
              <el-option label="450 - 499" value="450-499" />
              <el-option label="350 - 400" value="350-400" />
            </el-select>
          </el-form-item>
          <el-form-item class="w-50">
            <el-select
              v-model="formSearch.blacklist"
              placeholder="Blacklist"
              clearable
            >
              <el-option label="0" value="0" />
              <el-option label="1" value="1" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button
          type="reset"
          class="btn btn-sm btn-white btn-active-light-primary me-2"
          data-kt-menu-dismiss="true"
        >
          Close
        </button>

        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click.prevent="searchCustomerHandler"
          data-kt-menu-dismiss="true"
        >
          Apply
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "search-customer-dropdown",
  components: {},
  setup(props, ctx) {
    const columns = ref([
      {
        name: "User Score",
        key: "user-score",
      },
      {
        name: "Blacklist",
        key: "blacklist",
      },
      {
        name: "Credit Score",
        key: "credit-score",
      },
      {
        name: "Job Score",
        key: "job-score",
      },
    ]);
    const formSearch = ref({
      idNo: "",
      tel: "",
      name: "",
      acctNo: "",
      userScore: "",
      blacklist: "",
      dateRange: [],
    });

    const searchCustomerHandler = () => {
      ctx.emit("search", formSearch.value);
      formSearch.value = {
        idNo: "",
        tel: "",
        name: "",
        acctNo: "",
        userScore: "",
        blacklist: "",
        dateRange: [],
      };
    };

    return {
      columns,
      formSearch,
      searchCustomerHandler,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.el-date-editor--daterange.el-input__inner),
:deep(.el-select) {
  width: 100%;
}

:deep(.el-range-editor.el-input__inner) {
  justify-content: space-around;
}
</style>
