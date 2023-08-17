<template>
  <!--begin::Toolbar-->
  <!--  <div id="nh_editor_toolbar" class="ql-toolbar d-flex flex-stack py-2">-->
  <!--    <span class="ql-formats" v-for="(item, i) in toolbarOptions" :key="i">-->
  <!--      <button :class="`ql-${btn}`" v-for="(btn, j) in item" :key="j"></button>-->
  <!--    </span>-->
  <!--  </div>-->
  <!--end::Toolbar-->
  <!--  <div class="separator"></div>-->
  <!--  &lt;!&ndash;begin::Editor&ndash;&gt;-->
  <!--  <div id="nh_editor" class="py-6"></div>-->
  <!--end::Editor-->
  {{ test }}
  <Editor :init="initTinyMCE" v-model="test" />
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
// import Quill from "quill";
// import table_icon from "quill/assets/icons/table.svg";
// import * as QuillTableUI from 'quill-table-ui';
//
// Quill.register({
//   'modules/tableUI': QuillTableUI.default
// }, true);

import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce";

export default defineComponent({
  name: "nh-editor",
  components: {
    Editor,
  },
  setup() {
    // const toolbarOptions = [
    //   [
    //     {'font': ['Arial', 'Bahnschrift', 'Calibri', 'Candara', 'Century Gothic', 'Comic Sans MS', 'Consolas', 'Courier', 'Gabriola', 'Gadugi', 'Garamond', 'Georgia', 'Impact', 'Monaco']},
    //     {'size': ['small', false, 'large', 'huge']},
    //     {'header': [1, 2, 3, 4, 5, 6, false]}],  // custom dropdown
    //   ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //   ['blockquote', 'code-block'],
    //   [{'list': 'ordered'}, {'list': 'bullet'}],
    //   [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
    //   [{'color': []}, {'background': []}],          // dropdown with defaults from theme
    //   [{'align': []}],
    //   ['link', 'image'],
    //   ['clean']                                         // remove formatting button
    // ];
    // onMounted(() => {
    //   const editorId = "nh_editor";
    //   // init editor
    //   const editorOptions = {
    //     theme: "snow",
    //     modules: {
    //       toolbar: {
    //         container: [...toolbarOptions, [{table: table_icon}]],
    //         handlers: {
    //           table() {
    //             table.insertTable(3, 3)
    //           }
    //         }
    //       },
    //       table: true,
    //       tableUI: true,
    //     },
    //   };
    //   const icons = Quill.import('ui/icons');
    //   icons["table"] = '<svg viewbox="0 0 18 18">\n' +
    //       '<rect class="ql-stroke" height="12" width="12" x="3" y="3"/>\n' +
    //       '<rect class="ql-fill" height="2" width="3" x="5" y="5"/>\n' +
    //       '<rect class="ql-fill" height="2" width="4" x="9" y="5"/>\n' +
    //       '<g class="ql-fill ql-transparent">\n' +
    //       '<rect height="2" width="3" x="5" y="8"/>\n' +
    //       '<rect height="2" width="4" x="9" y="8"/>\n' +
    //       '<rect height="2" width="3" x="5" y="11"/>\n' +
    //       '<rect height="2" width="4" x="9" y="11"/>\n' +
    //       '</g>\n' +
    //       '</svg>';
    //   // Init editor
    //   const snowStyle = new Quill("#" + editorId, editorOptions);
    //   const table = snowStyle.getModule('table');
    //   console.log(table)
    // });
    // return {
    //   toolbarOptions,
    // }
    const initTinyMCE = {
      height: 500,
      menubar: false,
      plugins: [
        "accordion",
        "advlist",
        "autolink",
        "link",
        "image",
        "lists",
        "charmap",
        "preview",
        "anchor",
        "pagebreak",
        "searchreplace",
        "wordcount",
        "visualblocks",
        "visualchars",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "emoticons",
        "help",
        "wordcount",
        "quickbars",
      ],
      // toolbar: 'undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons',
      toolbar:
        "undo redo | fontfamily fontsize fontsizeinput forecolor backcolor formatting heading aligning | bullist numlist outdent indent | table link image media | blockquote accordion anchor searchreplace fullscreen",
      toolbar_groups: {
        formatting: {
          icon: "bold",
          tooltip: "Formatting",
          items: "bold italic underline strikethrough | superscript subscript",
        },
        heading: {
          icon: "format",
          tooltip: "Heading",
          items: "h1 h2 h3 h4 h5 h6",
        },
        aligning: {
          icon: "align-left",
          tooltip: "Aligning",
          items: "alignleft aligncenter alignright alignjustify alignnone",
        },
      },
      /* enable title field in the Image dialog*/
      image_title: true,
      /* enable automatic uploads of images represented by blob or data URIs*/
      automatic_uploads: true,
      file_picker_types: "image",
      /* and here's our custom image picker*/
      file_picker_callback: (cb, value, meta) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        input.addEventListener("change", (e) => {
          const file = e.target.files[0];

          const reader = new FileReader();
          reader.addEventListener("load", () => {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            const id = "blobid" + new Date().getTime();
            const blobCache = tinymce.activeEditor.editorUpload.blobCache;
            const base64 = reader.result.split(",")[1];
            const blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);

            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          });
          reader.readAsDataURL(file);
        });

        input.click();
      },
    };
    const test = ref();
    return {
      initTinyMCE,
      test,
    };
  },
});
</script>

<style scoped lang="scss">
.nh-editor {
  height: 300px;
}

$text-editor-fonts: "Arial", "Bahnschrift", "Calibri", "Candara",
  "Century Gothic", "Comic Sans MS", "Consolas", "Courier", "Gabriola", "Gadugi",
  "Garamond", "Georgia", "Impact", "Monaco";

@each $text-editor-font in $text-editor-fonts {
  .ql-font-#{$text-editor-font} {
    font-family: $text-editor-font !important;
  }

  .ql-snow
    .ql-picker-options
    .ql-picker-item[data-value="#{$text-editor-font}"] {
    font-family: $text-editor-font;

    &::before {
      content: $text-editor-font !important;
    }
  }

  .ql-snow
    .ql-picker.ql-font
    .ql-picker-label[data-value="#{$text-editor-font}"]::before,
  .ql-snow
    .ql-picker.ql-font
    .ql-picker-item[data-value="#{$text-editor-font}"]::before {
    content: $text-editor-font !important;
  }
}
</style>
