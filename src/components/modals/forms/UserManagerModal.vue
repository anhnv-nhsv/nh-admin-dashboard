<template>
  <div
    class="modal fade"
    id="kt_user_action_modal"
    ref="userModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-800px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">
            {{ translate("addUserList") }}
          </h2>
          <h2 class="fw-bolder" v-else>{{ translate("editReportCate") }}</h2>
          <div
            id="kt_user_action_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body scroll-y mx-5 mx-xl-5">
          <NhForm>
            <template v-slot:customForm>
              <el-form
                ref="ruleFormRef"
                :model="userForm"
                label-width="160px"
                :rules="rules"
              >
                <div v-if="action === 'add'">
                  <el-form-item :label="translate('userName')" prop="username">
                    <el-input
                      v-model="userForm.username"
                      :placeholder="translate('userName')"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item
                    :label="translate('userPassword')"
                    prop="password"
                  >
                    <el-input
                      v-model="userForm.password"
                      :placeholder="translate('userPassword')"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item :label="translate('email')" prop="email">
                    <el-input
                      v-model="userForm.email"
                      type="email"
                      :placeholder="translate('email')"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item :label="translate('role')" prop="role_id">
                    <el-select
                      :placeholder="translate('role')"
                      v-model="userForm.role_id"
                    >
                      <el-option label="Admin" value="1" />
                      <el-option label="Reporter" value="2" />
                      <el-option label="Marketing" value="3" />
                    </el-select>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item :label="translate('role')" prop="role_id">
                    <el-select
                      :placeholder="translate('role')"
                      v-model="userForm.role_id"
                    >
                      <el-option label="Admin" value="1" />
                      <el-option label="Reporter" value="2" />
                      <el-option label="Marketing" value="3" />
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_user_action_cancel"
            class="btn btn-light me-3"
            @click.prevent="resetForm(ruleFormRef)"
          >
            {{ translate("reset") }}
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            @click.prevent="handleRequest(ruleFormRef)"
          >
            <span v-if="!loading" class="indicator-label">
              {{ translate("sure") }}
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="loading" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import { translate } from "@/core/helpers/i18n-translate";
import NhForm from "@/components/nh-forms/NHForm.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import type { FormInstance } from "element-plus";
import qs from "qs";
import { hideModal } from "@/core/helpers/dom";
import { useUserMgmt } from "@/stores/user-mgmt";

export default defineComponent({
  name: "banner-category-modal",
  components: { NhForm },
  props: {
    action: { type: String, default: () => "add", required: false },
    data: {
      type: Object,
      default: () => {
        return {};
      },
      required: true,
    },
  },
  setup(props, ctx) {
    const loading = ref(false);
    const store = useUserMgmt();
    const ruleFormRef = ref<FormInstance>();
    const userModalRef = ref<null | HTMLElement>(null);
    const userForm = ref({
      username: "",
      password: "",
      email: "",
      role_id: "",
    });
    const idRow = ref();
    const idRole = ref();
    const rules = reactive({
      username: [
        {
          required: true,
          message: translate("useNameValidate"),
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: translate("passwordValidate"),
          trigger: "blur",
        },
      ],
      role_id: [
        {
          required: true,
          message: translate("roleValidate"),
          trigger: "change",
        },
      ],
      email: [
        {
          required: true,
          message: translate("emailValidate"),
          trigger: "blur",
        },
        {
          type: "email",
          message: translate("emailValidateRule"),
          trigger: ["blur", "change"],
        },
      ],
    });
    watch(
      () => props.data,
      (newVal) => {
        if (Object.keys(newVal).length > 0 && newVal.constructor === Object) {
          const newData = JSON.parse(JSON.stringify(newVal));
          userForm.value.role_id =
            newData.role_id === 1
              ? "1"
              : newData.role_id === 2
              ? "2"
              : newData.role_id === 3
              ? "3"
              : "";
          idRow.value = newData.id;
          idRole.value = newData.role_id;
        }
      }
    );

    watch(
      () => props.action,
      (newVal) => {
        if (newVal === "add") {
          userForm.value.role_id = "";
        }
      }
    );
    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const handleRequest = (formEl: FormInstance | undefined) => {
      loading.value = true;
      if (!formEl) return;
      formEl.validate(async (valid, fields) => {
        if (valid) {
          if (props.action === "add") {
            const result = await store.createUser(
              qs.stringify(JSON.parse(JSON.stringify(userForm.value)))
            );
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("addNewsSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                formEl.resetFields();
                hideModal(userModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          } else {
            const result = await store.updateUser(
              qs.stringify({
                id: idRow.value,
                role_id: userForm.value.role_id,
              })
            );
            if (result.data.success === true) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: translate("editRoleSuccessfully"),
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                ctx.emit("on-close");
                formEl.resetFields();
                hideModal(userModalRef.value);
              });
            } else {
              Swal.fire({
                position: "center",
                icon: "error",
                title: result.data.mess,
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        } else {
          console.log("error submit!", fields);
        }
      });
      loading.value = false;
    };

    return {
      userForm,
      ruleFormRef,
      rules,
      loading,
      userModalRef,
      handleRequest,
      resetForm,
      translate,
    };
  },
});
</script>

<style scoped lang="scss"></style>
