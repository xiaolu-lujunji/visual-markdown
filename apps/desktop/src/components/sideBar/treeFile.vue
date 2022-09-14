<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useExplorerStore } from '../../stores/explorer';
import { useTabsStore } from '../../stores/tabs';
import store from '../../store';
import FileIcon from './icon.vue';
import { showContextMenu } from '../../contextMenu/sideBar';
import bus from '../../bus';
import { isSamePathSync } from 'common/filesystem/paths';
import { ipcRenderer } from 'electron';

export default defineComponent({
  components: {
    FileIcon,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const explorerStore = useExplorerStore();
    const tabsStore = useTabsStore();

    const input = ref<HTMLInputElement | null>(null);
    const newFilename = ref('');

    const pathOfTheItemToBeRenamed = computed(() => explorerStore.pathOfTheItemToBeRenamed);
    const selected = computed(() => props.file.pathname === tabsStore.currentTab.pathname);
    const active = computed(() => props.file.id === explorerStore.focusedItem?.id);

    const handleKeyDownEnter = () => {
      if (newFilename.value) {
        store.dispatch('RENAME_IN_SIDEBAR', newFilename.value);
      }
    };

    const noop = () => {};

    const handleClick = () => {
      const { isMarkdown, pathname } = props.file;
      if (!isMarkdown) return;
      const openedTab = tabsStore.tabs.find((tab) => isSamePathSync(tab.pathname, pathname));
      if (openedTab) {
        if (tabsStore.currentTab === openedTab) return;
        store.dispatch('UPDATE_CURRENT_FILE', openedTab);
      } else {
        ipcRenderer.send('mt::open-file', pathname, {});
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      store.dispatch('CHANGE_ACTIVE_ITEM', props.file);
      showContextMenu(event, false);
    };

    bus.$on('SIDEBAR::show-rename-input', () => {
      input.value?.focus();
      newFilename.value = props.file.name;
    });

    return {
      input,
      newFilename,
      pathOfTheItemToBeRenamed,
      selected,
      active,
      handleKeyDownEnter,
      noop,
      handleClick,
      handleContextMenu,
    };
  },
});
</script>

<template>
  <div
    :title="file.pathname"
    class="side-bar-file"
    :style="{ 'padding-left': `${depth * 20 + 20}px`, opacity: file.isMarkdown ? 1 : 0.75 }"
    :class="[{ current: selected, active }]"
    @click="handleClick"
    @contextmenu.stop="handleContextMenu"
  >
    <file-icon :name="file.name"></file-icon>
    <input
      ref="input"
      v-model="newFilename"
      type="text"
      class="rename"
      v-if="pathOfTheItemToBeRenamed === file.pathname"
      @click.stop="noop"
      @keydown.enter="handleKeyDownEnter"
    />
    <span v-else>{{ file.name }}</span>
  </div>
</template>

<style scoped>
.side-bar-file {
  display: flex;
  position: relative;
  align-items: center;
  cursor: default;
  user-select: none;
  height: 30px;
  box-sizing: border-box;
  padding-right: 15px;

  &:hover {
    background: var(--sideBarItemHoverBgColor);
  }

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &::before {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    background: var(--themeColor);
    width: 2px;
    height: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;
  }
}

.side-bar-file.current::before {
  height: 100%;
}

.side-bar-file.current > span {
  color: var(--themeColor);
}

.side-bar-file.active > span {
  color: var(--sideBarTitleColor);
}

input.rename {
  height: 22px;
  outline: none;
  margin: 5px 0;
  padding: 0 8px;
  color: var(--sideBarColor);
  border: 1px solid var(--floatBorderColor);
  background: var(--floatBorderColor);
  width: 100%;
  border-radius: 3px;
}
</style>
