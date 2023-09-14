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
        >
          <KTIcon icon-name="plus" icon-class="fs-2" />
          Add user
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
            label="STT"
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
          <span v-if="row['role_id'] !== 1">
            <span class="badge badge-light-success">User</span>
          </span>
        </template>
        <template v-slot:actionColumn>
          <el-table-column
            header-align="center"
            class-name="text-center"
            label="Thao tác"
            width="100"
          >
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                @click.prevent="deleteUser(scope.row)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </template>
      </NHDatatable>
    </div>
  </div>
  <AddUserModal @on-close="handleCloseModal" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import NHDatatable from "@/components/nh-datatable/NHDatatable.vue";
import AddUserModal from "@/components/modals/forms/AddUserModal.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useUserMgmt } from "@/stores/user-mgmt";

export default defineComponent({
  name: "user-management",
  components: {
    NHDatatable,
    AddUserModal,
  },
  setup() {
    const store = useUserMgmt();
    const tableHeader = ref([
      {
        label: "Tên",
        prop: "name",
        visible: true,
      },
      {
        label: "Email",
        prop: "email",
        visible: true,
      },
      {
        label: "Vai trò",
        prop: "role_id",
        visible: true,
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
          const response = await store.deleteUser({ username: val.name });
          if (response.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Success!",
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

    const handleCloseModal = () => {
      getAllUser();
    };

    return {
      userList,
      tableHeader,
      loading,
      Search,
      deleteUser,
      handleCloseModal,
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
