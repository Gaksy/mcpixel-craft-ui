import McPixelButton from "./McPixelButton.vue";

export { McPixelButton };

export default {
  install(app: any) {
    app.component("McPixelButton", McPixelButton);
  },
};
