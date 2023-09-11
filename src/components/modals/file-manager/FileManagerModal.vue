<template>
  <div
    class="modal fade"
    id="kt_file_manager_modal"
    ref="fileManagerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-scrollable modal-dialog-centered mw-1000px mh-100"
    >
      <div class="modal-content">
        <div class="modal-body mx-5 mx-xl-5 my-7">
          <iframe
            ref="fileManagerIframe"
            class="rounded h-500px w-100"
            src="http://127.0.0.1/filemanager/plugins/filemanager/dialog.php?type=0&field_id=imgField&crossdomain=1"
            :allowfullscreen="true"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { hideModal } from "@/core/helpers/dom";

export default {
  name: "file-manager-modal",
  props: {
    isShown: { type: Boolean, default: () => false, required: false },
  },
  setup(props, ctx) {
    const iframeWindow = ref<HTMLIFrameElement | null>(null);
    const fileManagerModalRef = ref<null | HTMLElement>(null);
    const onIframeLoad = () => {
      console.log("onIframeLoad");
      // const iframeWindow = this.$refs.fileManagerIframe.contentWindow;
      if (iframeWindow.value?.contentWindow) {
        iframeWindow.value.addEventListener("message", onMessage);
      }
    };

    const onMessage = (event) => {
      // Handle messages received from the iframe
      if (event.data.sender === "responsivefilemanager") {
        console.log(event);
        if (event.data.field_id) {
          var fileUrl = event.data.url;

          // Emit a custom event to notify the parent component
          ctx.emit("file-selected", fileUrl);

          // Close modal or perform other actions
          // ...
          hideModal(fileManagerModalRef.value);
        }
      }
    };

    // Attach the OnMessage function to the window's message event
    onMounted(() => {
      window.addEventListener("message", onMessage);
    });

    // Detach the event listener when the component is unmounted
    onUnmounted(() => {
      window.removeEventListener("message", onMessage);
    });

    return {
      iframeWindow,
      fileManagerModalRef,
      onIframeLoad,
    };
  },
};
</script>

<style scoped lang="scss"></style>
