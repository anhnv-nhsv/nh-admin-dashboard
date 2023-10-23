<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="flex-column"></div>
      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#kt_user_action_modal"
          @click="addUser"
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          {{ translate("addUser") }}
        </button>
      </div>
    </div>
    <div class="card-body pt-0">
      <NHDatatable
        :table-header="tableHeader"
        :table-data="userList"
        :loading="loading"
        :show-overflow-tooltip="true"
      >
        <template v-slot:indexColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            :label="translate('index')"
            type="index"
            width="55"
          />
        </template>
        <template v-slot:avatar="{ row }">
          <img :src="row.avatar" :alt="row.name" class="table-img" />
        </template>
        <template v-slot:role_id="{ row }">
          <span v-if="row['role_id'] === 1">
            <span class="badge badge-light-primary">Admin</span>
          </span>
          <span v-if="row['role_id'] === 2">
            <span class="badge badge-light-success">User</span>
          </span>
          <span v-if="row['role_id'] === 3">
            <span class="badge badge-light-success">Marketing</span>
          </span>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            :label="translate('action')"
            width="250"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteUser(scope.row)"
              >
                {{ translate("deleteBtn") }}
              </el-button>
              <el-button
                size="small"
                type="default"
                data-bs-toggle="modal"
                data-bs-target="#kt_user_action_modal"
                @click.prevent="editUserRole(scope.row)"
              >
                {{ translate("changeRole") }}
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <UserManagerModal
    @on-close="handleCloseModal"
    :data="rowDetail"
    :action="userAction"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { translate } from "@/core/helpers/i18n-translate";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import UserManagerModal from "@/components/modals/forms/UserManagerModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useUserMgmt } from "@/stores/user-mgmt";

export default defineComponent({
  name: "user-management",
  components: {
    NHDatatable,
    UserManagerModal,
  },
  setup() {
    const store = useUserMgmt();
    const rowDetail = ref();
    const tableHeader = ref([
      {
        label: "name",
        prop: "name",
        visible: true,
        width: 200,
      },
      {
        label: "email",
        prop: "email",
        visible: true,
      },
      {
        label: "role",
        prop: "role_id",
        visible: true,
        width: 150,
      },
      {
        label: "Avatar",
        width: 150,
        prop: "avatar",
        visible: true,
      },
    ]);
    const loading = ref<boolean>(false);
    const userList = ref([]);
    let userAction = ref("");

    const getAllUser = async () => {
      loading.value = true;
      await store.getUserList(undefined);
      const response = JSON.parse(JSON.stringify(store.userList));
      userList.value = response.data;
      loading.value = false;
    };

    onBeforeMount(() => {
      getAllUser();
    });

    const deleteUser = (val) => {
      Swal.fire({
        title: translate("confirmation"),
        text: translate("deleteWarning"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-secondary",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await store.deleteUser({ username: val.name });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: translate("successfully"),
              showConfirmButton: false,
              timer: 1000,
            });
            await getAllUser();
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

    const addUser = () => {
      userAction.value = "add";
    };
    const editUserRole = (val?: object | undefined) => {
      userAction.value = "edit";
      const rawVal = JSON.parse(JSON.stringify(val));
      rowDetail.value = rawVal;
    };

    const handleCloseModal = () => {
      getAllUser();
    };

    return {
      userList,
      userAction,
      tableHeader,
      loading,
      rowDetail,
      Search,
      addUser,
      editUserRole,
      deleteUser,
      translate,
      handleCloseModal,
    };
  },
});
</script>

<style scoped>
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
