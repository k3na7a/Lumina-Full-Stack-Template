import { App } from "vue";
import { CkeditorPlugin } from "@ckeditor/ckeditor5-vue";

// import 'ckeditor5/ckeditor5.css'

class Ckeditor5Service {
  public static init(app: App): void {
    app.use(CkeditorPlugin);
  }
}

export { Ckeditor5Service };
