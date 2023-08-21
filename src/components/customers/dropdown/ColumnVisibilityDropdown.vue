<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-250px" data-kt-menu="true">
    <!--begin::Form-->
    <div class="px-7 py-5">
      <div class="mb-10">
        <el-table
          :show-header="true"
          :data="columns"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="Columns name" prop="name" />
        </el-table>
      </div>
      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          @click.prevent="handleColumnVisibility"
          data-kt-menu-dismiss="true"
        >
          Apply
        </button>
      </div>
      <!--end::Actions-->
    </div>
    <!--end::Form-->
  </div>
  <!--end::Menu 1-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "column-visibility-dropdown",
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
    let multipleSelection = ref<any[]>([]);

    const handleSelectionChange = (val: any[]) => {
      multipleSelection.value = val;
    };

    const handleColumnVisibility = () => {
      ctx.emit("selection-change", multipleSelection.value);
    };

    return {
      columns,
      handleColumnVisibility,
      handleSelectionChange,
    };
  },
});
</script>
