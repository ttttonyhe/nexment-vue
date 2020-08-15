/**
 * Nexment Web Component
 */
import Vue from "vue";
import wrap from "@vue/web-component-wrapper";
import NexmentContainer from "./components/container/component.vue";

const Element = wrap(Vue, NexmentContainer);

// Avoid console error
window.onerror = function() {
  return true;
};

// Define web component
window.customElements.define("nexment-container", Element);
