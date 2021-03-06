<template>
  <div
    v-whppt-content="contentItems"
    :whitelist="whitelist"
    :blacklist="blacklist"
    class="whppt-contents"
    :class="{ 'whppt-contents--active': activeMenuItem }"
  >
    <div v-for="content in initContentItems" :key="`${content.componentType}-${content.key}`" class="whppt-content">
      <div>
        <component
          :is="content.componentType"
          :key="`${content.componentType}-${content.key}`"
          v-whppt-actions="{ content, actions: actions(content) }"
          :content="content"
          :class="spacingClasses(content)"
          :container="container"
          :custom-class="customClass"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { map } from 'lodash';
import { nanoid } from 'nanoid';
import WhpptSpacer from '../ui/components/Spacer';
import WhpptButton from '../ui/components/Button';

export default {
  name: 'WhpptContent',
  components: {
    WhpptButton,
    WhpptSpacer,
  },
  props: {
    contentItems: { type: [Array, Object], required: true },
    container: { type: Boolean, default: true },
    whitelist: { type: Array, default: () => [] },
    blacklist: { type: Array, default: () => [] },
    customClass: { type: String, default: '' },
  },
  computed: {
    ...mapState('whppt/page', ['page']),
    ...mapState('whppt/editor', ['activeMenuItem', 'editSidebar', 'draft']),
    initContentItems() {
      // TODO: work out why this.page.pageType would ever be an object and if it ever is, should we allow that?
      if (this.page && this.page.pageType && typeof this.page.pageType === 'object') return;
      const definitions = this.$whppt.getComponentDefinitions(this.page.pageType);
      return map(this.contentItems, ci => {
        ci.key = nanoid();
        const componentInit = definitions && definitions[ci.componentType] && definitions[ci.componentType].init;
        if (typeof componentInit === 'function') componentInit({ $set: this.$set }, ci);

        return ci;
      });
    },
  },
  methods: {
    ...mapActions('whppt/editor', [
      'selectContent',
      'selectComponent',
      'moveComponentUp',
      'moveComponentDown',
      'removeComponent',
      'doEditInSidebar',
    ]),
    ...mapMutations('whppt/editor', ['editInSidebar']),
    getComponentDefinition(componentType) {
      const definitions = this.$whppt.getComponentDefinitions(this.page.pageType);
      return definitions[componentType];
    },
    actions(content) {
      const componentDefinition = this.getComponentDefinition(content.componentType);
      return [
        { label: 'Up', classes: 'whppt-icon whppt-icon-up', action: this.moveComponentUp },
        { label: 'Down', classes: 'whppt-icon whppt-icon-down', action: this.moveComponentDown },
        { label: 'Remove', classes: 'whppt-icon whppt-icon-delete', action: this.remove },
        componentDefinition &&
          !componentDefinition.hideSpacingInContent && {
            label: 'Spacing',
            classes: 'whppt-icon whppt-icon-spacing ',
            action: () => this.doEditInSidebar('SpacingControls'),
          },
        {
          label: 'Duplicate Components',
          classes: 'whppt-icon whppt-icon-copy',
          action: () => this.doEditInSidebar('DuplicateComponent'),
        },
      ];
    },
    spacingClasses(content) {
      const componentDefinition = this.getComponentDefinition(content.componentType);
      if (componentDefinition && componentDefinition.hideSpacingInContent) return [];
      const { setMarginTop, setMarginBottom, setPaddingTop, setPaddingBottom } = this.$whppt.spacing;

      const marginTop = setMarginTop(content);
      const marginBottom = setMarginBottom(content);
      const paddingTop = setPaddingTop(content);
      const paddingBottom = setPaddingBottom(content);

      return [marginTop, marginBottom, paddingTop, paddingBottom];
    },
    remove() {
      if (window.confirm('Are you sure you want to delete this component?')) return this.removeComponent();
    },
  },
};
</script>

<style lang="scss" scoped>
.whppt-content {
  position: relative;

  .whppt-content__container {
    display: flex;
    justify-content: flex-end;
    position: relative;
  }
}
</style>

<style>
.whppt-contents--active {
  min-height: 200px;
}
</style>
