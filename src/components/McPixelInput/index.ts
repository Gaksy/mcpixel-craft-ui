import McPixelInput from "./McPixelInput.vue";
export { McPixelInput };

export default {
  install(app: any) {
    app.component("McPixelInput", McPixelInput);
  },
};
