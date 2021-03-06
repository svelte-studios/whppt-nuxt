<template>
  <whppt-tabs position="fixed" @changed="tabChanged">
    <whppt-tab v-for="(tab, index) in tabs" :id="tab.name" :key="index" :name="tab.label">
      <component
        :is="selectedTab"
        :settings="siteSettings"
        :page="page"
        :prefix="page && page.prefix"
        @closed="$emit('closed')"
      />
    </whppt-tab>
  </whppt-tabs>
</template>

<script>
import { clamp, filter } from 'lodash';
import { mapActions, mapState } from 'vuex';

import WhpptTabs from '../../ui/components/Tabs';
import WhpptTab from '../../ui/components/Tab';
import WhpptButton from '../../ui/components/Button';

import SEO from './tabs/SEO';
import Twitter from './tabs/Twitter';
import OpenGraph from './tabs/OpenGraph';
import General from './tabs/General';
import Roles from './tabs/Roles';

const { additionalTabs, additionalComponents } = global.$whppt.getAdditionalComponents('pageSettings');

export default {
  name: 'WhpptPageSettings',
  components: {
    ...additionalComponents,
    SEO,
    General,
    Twitter,
    OpenGraph,
    Roles,
    WhpptTabs,
    WhpptTab,
    WhpptButton,
  },
  props: { prefix: { type: String, default: '' } },
  data: () => ({
    usedListings: [],
    warningId: undefined,
    siteSettings: { og: { image: {} }, twitter: { image: {} } },
    selectedTab: 'general',
  }),
  computed: {
    ...mapState('whppt/page', ['page']),
    tabs() {
      const conditionalTabs = filter(additionalTabs, tab => {
        if (tab.condition) return tab.condition({ page: this.page });
        return true;
      });

      return [
        { name: 'general', label: 'General' },
        { name: 's-e-o', label: 'Seo' },
        { name: 'open-graph', label: 'Open Graph' },
        { name: 'twitter', label: 'Twitter' },
        { name: 'roles', label: 'Roles' },
        ...conditionalTabs,
      ];
    },
  },
  mounted() {
    this.page.og = this.page.og || { title: '', keywords: '', image: { imageId: '', crop: {} } };
    this.page.twitter = this.page.twitter || { title: '', keywords: '', image: { imageId: '', crop: {} } };
    this.page.frequency = this.page.frequency || 'yearly';
  },
  methods: {
    ...mapActions('whppt/page', ['savePage']),
    tabChanged(_, index) {
      this.selectedTab = this.tabs[index].name;
    },
    saveSettings() {
      if (this.page.priority) {
        this.page.priority = clamp(this.page.priority, 0, 1);
      }
      return this.savePage();
    },
  },
};
</script>

<style lang="scss" scoped></style>
