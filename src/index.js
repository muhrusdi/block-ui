import "grapesjs/dist/css/grapes.min.css";
import grapesjs from "grapesjs";
import { layer, section, text, image, block, style, deviceMobile, deviceDesktop } from "./utils/icons";
import "./styles/colors.scss";
import "grapesjs/src/styles/scss/main.scss";
import "./styles/styles.scss";

const editor = grapesjs.init({
  container: "#gjs",
  fromElement: true,
  height: "100%",
  width: "auto",
  storageManager: false,
  blockManager: {
    appendTo: ".blocks-container",
    blocks: [
      {
        id: "section", 
        label: section,
        attributes: { class: "gjs-block-section" },
        content: `<section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`
      },
      {
        id: "text",
        label: text,
        content: '<div data-gjs-type="text">Insert your text here</div>'
      },
      {
        id: "image",
        label: image,
        select: true,
        content: { type: "image" },
        activate: true
      }
    ]
  },
  layerManager: {
    appendTo: ".layers-container"
  },
  panels: {
    defaults: [
      {
        id: "panel-switcher",
        el: ".panel__switcher",
        buttons: [
          {
            id: "show-blocks",
            active: true,
            label: block,
            command: "show-blocks",
            togglable: false
          },
          {
            id: "show-layers",
            active: true,
            label: layer,
            command: "show-layers",
            togglable: false
          },
          {
            id: "show-style",
            active: true,
            label: style,
            command: "show-styles",
            togglable: false
          }
        ]
      },
      {
        id: "panel-devices",
        el: ".panel__devices",
        buttons: [
          {
            id: "device-desktop",
            label: deviceDesktop,
            command: "set-device-desktop",
            active: true,
            togglable: false
          },
          {
            id: "device-mobile",
            label: deviceMobile,
            command: "set-device-mobile",
            togglable: false
          }
        ]
      },
      {
        id: "layers",
        el: ".panel__right",
        resizable: {
          maxDim: 350,
          minDim: 200,
          tc: 0, // Top handler
          cl: 1, // Left handler
          cr: 0, // Right handler
          bc: 0, // Bottom handler
          keyWidth: "flex-basis"
        }
      }
    ]
  },
  selectorManager: {
    appendTo: ".styles-container"
  },
  deviceManager: {
    devices: [
      {
        name: "Desktop",
        width: "" 
      },
      {
        name: "Mobile",
        width: "320px", 
        widthMedia: "480px"
      }
    ]
  },
  styleManager: {
    appendTo: ".styles-container",
    sectors: [
      {
        name: "Dimension",
        open: false,
        buildProps: ["width", "min-height", "padding"],
        properties: [
          {
            type: "integer",
            name: "The width", 
            property: "width", 
            units: ["px", "%"],
            defaults: "auto", 
            min: 0 
          }
        ]
      },
      {
        name: "Extra",
        open: false,
        buildProps: ["background-color", "box-shadow", "custom-prop"],
        properties: [
          {
            id: "custom-prop",
            name: "Custom Label",
            property: "font-size",
            type: "select",
            defaults: "32px",
            options: [
              { value: "12px", name: "Tiny" },
              { value: "18px", name: "Medium" },
              { value: "32px", name: "Big" }
            ]
          }
        ]
      }
    ]
  }
});

editor.Panels.addPanel({
  id: "panel-top",
  el: ".panel__top"
});

editor.Panels.addPanel({
  id: "basic-actions",
  el: ".panel__basic-actions",
  buttons: [
    {
      id: "visibility",
      active: false, 
      className: "btn-toggle-borders logo-block-ui",
      label: "<h1>Block UI</h1>",
      command: "sw-visibility" 
    },
    {
      id: "export",
      className: "btn-open-export",
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 19h16v-7h2v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-8h2v7zm9-10v7h-2V9H6l6-6 6 6h-5z"/></svg>',
      command: "export-template",
      context: "export-template" 
    },
    {
      id: "show-json",
      className: "btn-show-json",
      label:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 18v-3.7a1.5 1.5 0 0 0-1.5-1.5H2v-1.6h.5A1.5 1.5 0 0 0 4 9.7V6a3 3 0 0 1 3-3h1v2H7a1 1 0 0 0-1 1v4.1A2 2 0 0 1 4.626 12 2 2 0 0 1 6 13.9V18a1 1 0 0 0 1 1h1v2H7a3 3 0 0 1-3-3zm16-3.7V18a3 3 0 0 1-3 3h-1v-2h1a1 1 0 0 0 1-1v-4.1a2 2 0 0 1 1.374-1.9A2 2 0 0 1 18 10.1V6a1 1 0 0 0-1-1h-1V3h1a3 3 0 0 1 3 3v3.7a1.5 1.5 0 0 0 1.5 1.5h.5v1.6h-.5a1.5 1.5 0 0 0-1.5 1.5z"/></svg>',
      context: "show-json",
      command(editor) {
        editor.Modal.setTitle("Components JSON")
          .setContent(
            `<textarea style="width:100%; height: 250px;">
            ${JSON.stringify(editor.getComponents())}
          </textarea>`
          )
          .open();
      }
    }
  ]
});

// Define commands
editor.Commands.add("show-layers", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getLayersEl(row) {
    return row.querySelector(".layers-container");
  },

  run(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "";
  },
  stop(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "none";
  }
});
editor.Commands.add("show-blocks", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getLayersEl(row) {
    return row.querySelector(".blocks-container");
  },

  run(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "";
  },
  stop(editor, sender) {
    const lmEl = this.getLayersEl(this.getRowEl(editor));
    lmEl.style.display = "none";
  }
});
editor.Commands.add("show-styles", {
  getRowEl(editor) {
    return editor.getContainer().closest(".editor-row");
  },
  getStyleEl(row) {
    return row.querySelector(".styles-container");
  },

  run(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = "";
  },
  stop(editor, sender) {
    const smEl = this.getStyleEl(this.getRowEl(editor));
    smEl.style.display = "none";
  }
});

editor.Commands.add("set-device-desktop", {
  run: editor => editor.setDevice("Desktop")
});
editor.Commands.add("set-device-mobile", {
  run: editor => editor.setDevice("Mobile")
});
