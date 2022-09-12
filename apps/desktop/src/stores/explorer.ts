import { computed } from 'vue';
import { defineStore } from 'pinia';
// @ts-ignore
import store from '../store';

export interface Directory {
  id: number;
}

export interface File {
  id: number;
}

export const useExplorerStore = defineStore('explorer', () => {
  const pathOfTheItemToBeRenamed = computed<string | null>(() => store.state.project.renameCache);
  const focusedItem = computed<Directory | File | null>(() => store.state.project.activeItem);

  return {
    pathOfTheItemToBeRenamed,
    focusedItem,
  };
});
