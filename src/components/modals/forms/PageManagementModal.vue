<template>
  <div
    class="modal fade"
    id="kt_page_modal"
    ref="pageModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-1000px"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder" v-if="action === 'add'">Add Page</h2>
          <h2 class="fw-bolder" v-else>Edit Page</h2>
          <div
            id="kt_customer_export_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body mx-5 mx-xl-5 my-7">
          <NhForm seoable>
            <template v-slot:customForm>
              <el-form
                ref="ruleFormRef"
                :model="pageForm"
                label-width="160px"
                class="demo-ruleForm"
                status-icon
                :size="formSize"
                :rules="rules"
              >
                <el-form-item>
                  <ul
                    class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6"
                  >
                    <li class="nav-item">
                      <a
                        class="nav-link active"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_1"
                        >Tiếng Việt</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_2"
                        >Tiếng Anh</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        data-bs-toggle="tab"
                        href="#nh_tab_pane_3"
                        >Tiếng Hàn</a
                      >
                    </li>
                  </ul>
                </el-form-item>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nh_tab_pane_1"
                    role="tabpanel"
                  >
                    <el-form-item label="Tiêu đề" prop="name">
                      <el-input
                        v-model="pageForm.name"
                        placeholder="Tiếng Việt"
                        clearable
                        @input="generateSlug(pageForm.name)"
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung" prop="content">
                      <NhEditor
                        v-model="pageForm.content"
                        placeholder="Tiếng Việt"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_2" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="pageForm.name_english"
                        placeholder="Tiếng Anh"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung">
                      <NhEditor
                        v-model="pageForm.content_english"
                        placeholder="Tiếng Anh"
                      />
                    </el-form-item>
                  </div>
                  <div class="tab-pane fade" id="nh_tab_pane_3" role="tabpanel">
                    <el-form-item label="Tiêu đề">
                      <el-input
                        v-model="pageForm.name_korea"
                        placeholder="Tiếng Hàn"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="Nội dung">
                      <NhEditor
                        v-model="pageForm.content_korea"
                        placeholder="Tiếng Hàn"
                      />
                    </el-form-item>
                  </div>
                </div>
                <el-form-item label="Bài viết cha" prop="parentCategory">
                  <el-cascader
                    v-model="pageForm.parentCategory"
                    :options="parents"
                    :props="cascaderConfig"
                    clearable
                    filterable
                    style="width: 100%"
                    @change="handleChangeCategory"
                  />
                </el-form-item>
                <el-form-item label="Hình ảnh">
                  <el-button
                    size="small"
                    type="default"
                    data-bs-toggle="modal"
                    data-bs-target="#kt_file_manager_modal"
                    @click="handleSave"
                  >
                    image
                  </el-button>
                </el-form-item>
                <el-form-item label="URL">
                  <el-input
                    v-model="pageForm.url"
                    placeholder="URL"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="Publish">
                  <el-switch v-model="pageForm.publish" />
                </el-form-item>
              </el-form>
            </template>
          </NhForm>
        </div>
        <div class="modal-footer">
          <button
            type="reset"
            id="kt_modal_test_editor_cancel"
            class="btn btn-light me-3"
            data-bs-dismiss="modal"
          >
            Discard
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            v-if="action === 'add'"
            @click="handleAdd(ruleFormRef)"
          >
            <span v-if="true" class="indicator-label">
              Add
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="false" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
          <button
            class="btn btn-lg btn-primary"
            type="submit"
            v-if="action === 'edit'"
            @click="handleEdit(ruleFormRef)"
          >
            <span v-if="true" class="indicator-label">
              Edit
              <span class="svg-icon svg-icon-3 ms-2 me-0">
                <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
              </span>
            </span>
            <span v-if="false" class="indicator-progress">
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
  <FileManagerModal @file-selected="getFileUrl" @handle-save="handleSave" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import FileManagerModal from "@/components/modals/file-manager/FileManagerModal.vue";
import NhForm from "@/components/nh-forms/NHForm.vue";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { FormInstance, UploadInstance } from "element-plus";
import NhEditor from "@/components/editor/NHEditor.vue";
import { usePageStore } from "@/stores/page";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { hideModal } from "@/core/helpers/dom";

export default defineComponent({
  name: "page-category-modal",
  props: {
    action: { type: String, default: () => "add", required: false },
    rowDetail: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    abc: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
    submitSearch: {
      type: Function,
    },
  },
  components: { NhEditor, NhForm, FileManagerModal },
  setup: function (props, ctx) {
    const store = usePageStore();
    const detailData = ref(props.rowDetail);
    const getAllRes = ref(props.abc);
    const publish = ref();
    const status = ref();
    const typePost = ref();
    const categoryId = ref();
    const parentId = ref();
    const idRow = ref();
    const urlIma = ref();
    const rowValue = ref(JSON.parse(JSON.stringify(detailData.value)));
    const qwe = ref(JSON.parse(JSON.stringify(getAllRes.value)));
    const parents = ref();
    const idSelect = ref();
    const dialogImageUrl = ref("");
    const dialogVisible = ref(false);
    const uploadRef = ref<UploadInstance>();
    const fileList = ref<any>([]);
    const formSize = ref("default");
    const ruleFormRef = ref<FormInstance>();
    const pageModalRef = ref<null | HTMLElement>(null);
    const rules = reactive({
      name: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
      name_korea: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
      name_english: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "blur",
        },
      ],
      parentCategory: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "change",
        },
      ],
      content: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "change",
        },
      ],
      content_english: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "change",
        },
      ],
      content_korea: [
        {
          required: true,
          message: "Trường này cần phải nhập!",
          trigger: "change",
        },
      ],
    });

    let pageForm = ref({
      name: "",
      name_english: "",
      name_korea: "",
      slug: "",
      content: "",
      content_english: "",
      content_korea: "",
      image: "",
      image_english: "",
      image_korea: "",
      featuredImgUrl: "",
      url: "/page/.html",
      parentCategory: [],
      publish: false,
    });

    function buildHierarchy(arr) {
      const hierarchy = {};
      // Create a map of id to item and initialize children
      for (const item of arr) {
        item.children = [];
        item.value = item.name;
        item.label = item.name;
        hierarchy[item.id] = item;
      }

      const tree: any = [];
      // Build the hierarchy
      for (const item of arr) {
        if (item.parent_id !== null) {
          if (hierarchy[item.parent_id]) {
            hierarchy[item.parent_id].children.push(item);
          }
        } else {
          tree.push(item);
        }
      }

      return tree;
    }

    watch(
      () => props.rowDetail,
      (newVal) => {
        if (Object.keys(newVal).length !== 0 && newVal.constructor === Object) {
          rowValue.value = newVal;
          pageForm.value.name = rowValue.value.name;
          pageForm.value.name_english = rowValue.value.name_english;
          pageForm.value.name_korea = rowValue.value.name_korea;
          pageForm.value.slug = rowValue.value.slug;
          pageForm.value.content = rowValue.value.content;
          pageForm.value.content_english = rowValue.value.content_english;
          pageForm.value.content_korea = rowValue.value.content_korea;
          pageForm.value.image = rowValue.value.image;
          pageForm.value.image_english = rowValue.value.image_english;
          pageForm.value.image_korea = rowValue.value.image_korea;
          pageForm.value.featuredImgUrl = rowValue.value.featuredImgUrl;
          pageForm.value.url = toSlug(rowValue.value.name);
          pageForm.value.publish = rowValue.value.publish === 0 ? false : true;
          publish.value = rowValue.value.publish;
          status.value = rowValue.value.status;
          typePost.value = rowValue.value.type_post;
          categoryId.value = rowValue.value.category_id;
          parentId.value = rowValue.value.parent_id;
          idRow.value = rowValue.value.id;
          const test = JSON.parse(JSON.stringify(rowValue.value.allPages));
          parents.value = buildHierarchy(test.data);
          pageForm.value.parentCategory = parents.value;
          for (let i = 0; i < parents.value.length; i++) {
            const resultCatId: any = searchTree(
              rowValue.value.id,
              parents.value[i]
            );
            if (resultCatId !== undefined) {
              pageForm.value.parentCategory = resultCatId;
            }
          }
        } else {
          pageForm.value = {
            name: "",
            name_english: "",
            name_korea: "",
            slug: "",
            content: "",
            content_english: "",
            content_korea: "",
            image: "",
            image_english: "",
            image_korea: "",
            featuredImgUrl: "",
            url: "/page/.html",
            parentCategory: [],
            publish: false,
          };
        }
      }
    );

    const searchTree = (nodeId, parent) => {
      const stack = [[parent, []]];
      while (stack.length) {
        const [node, path]: any = stack.pop();
        if (node.id === nodeId) {
          return [node.parent_id, node.id];
        }
        if (node.children) {
          stack.push(...node.children.map((node, i) => [node, [...path, i]]));
        }
      }
    };

    const cascaderConfig = {
      expandTrigger: "hover" as const,
      checkStrictly: true,
      value: "id",
    };

    const handleAdd = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.createPage({
            ...formData,
            status: "",
            type_post: "page",
            category_id: 10,
            parent_id: idSelect.value,
            slug: resSlug(formData.url),
            publish: formData.publish === false ? 0 : 1,
            image: urlIma.value || "",
          });
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Tạo thành công!",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: result.data.mess,
              showConfirmButton: false,
              timer: 1500,
            });
          }
          ctx.emit("submitSearch");
          hideModal(pageModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const handleEdit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          const formData = JSON.parse(JSON.stringify(pageForm.value));
          const result = await store.editPage({
            ...formData,
            status: status.value,
            type_post: typePost.value,
            category_id: categoryId.value,
            parent_id: idSelect.value,
            publish: formData.publish === false ? 0 : 1,
            id: idRow.value,
            slug: resSlug(formData.url),
            image: urlIma.value || "",
          });
          if (result.data.success === true) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Cập nhật thành công!",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: result.data.mess,
              showConfirmButton: false,
              timer: 1500,
            });
          }
          ctx.emit("submitSearch");
          hideModal(pageModalRef.value);
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    const handleChangeCategory = (value) => {
      const temp = JSON.parse(JSON.stringify(value));
      const a = temp[temp.length - 1];
      console.log("value: ", value);

      idSelect.value = a.toString();
    };

    const generateSlug = (title) => {
      pageForm.value.url = "/page/" + toSlug(title) + ".html";
    };

    const toSlug = (str) => {
      // Chuyển hết sang chữ thường
      str = str.toLowerCase();

      // xóa dấu
      str = str
        .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
        .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

      // Thay ký tự đĐ
      str = str.replace(/[đĐ]/g, "d");

      // Xóa ký tự đặc biệt
      str = str.replace(/([^0-9a-z-\s])/g, "");

      // Xóa khoảng trắng thay bằng ký tự -
      str = str.replace(/(\s+)/g, "-");

      // Xóa ký tự - liên tiếp
      str = str.replace(/-+/g, "-");

      // xóa phần dư - ở đầu & cuối
      str = str.replace(/^-+|-+$/g, "");

      // return
      return str;
    };

    const resSlug = (val) => {
      let a = 6;
      let b = val.length - 5;

      if (a < b) {
        return val.substring(a, b);
      }
    };

    const handleRemove = (file: any) => {
      uploadRef.value?.handleRemove(file);
      fileList.value = [];
    };

    const getFileUrl = (val) => {
      console.log("val: ", val);
      urlIma.value = val;
    };

    const handleSave = () => {};

    return {
      cascaderConfig,
      handleSave,
      pageForm,
      Delete,
      Plus,
      ZoomIn,
      dialogImageUrl,
      parents,
      dialogVisible,
      uploadRef,
      fileList,
      rowValue,
      qwe,
      rules,
      formSize,
      ruleFormRef,
      pageModalRef,
      handleChangeCategory,
      handleAdd,
      generateSlug,
      handleRemove,
      handleEdit,
      getFileUrl,
    };
  },
});
</script>

<style scoped lang="scss">
.tab-content {
  width: 100%;
}
.avatar-uploader .avatar {
  width: 100%;
  //height: 178px;
  display: block;
}
.hide-upload {
  :deep(div.el-upload.el-upload--picture-card) {
    display: none !important;
  }
}
</style>
