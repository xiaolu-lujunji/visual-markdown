import { computed } from 'vue';
import { defineStore } from 'pinia';
// @ts-ignore
import store from '../store';

export interface Tab {
  pathname: string;
}

export const useTabsStore = defineStore('tabs', () => {
  const currentTab = computed<Tab>(() => store.state.editor.currentFile);
  const tabs = computed<Tab[]>(() => store.state.editor.tabs);

  return {
    currentTab,
    tabs,
  };
});
