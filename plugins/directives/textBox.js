import Vue from 'vue';

// export default ({ store }, whppt) => {
export default ({ store, app: { $whppt }, menuIsInState, MENUSTATES }) => {
  Vue.directive('textBox', {
    bind(el, binding) {
      el.addEventListener('click', function(e) {
        $whppt.clearEditData();
        $whppt.clearContents();
        $whppt.clearSelected();

        if (!menuIsInState(MENUSTATES.SELECT)) return;
        $whppt.select(el, binding.value);
        $whppt.formatSelectedContentsElement();
        $whppt.edit(el, binding.value);
        store.commit('whppt-nuxt/editor/editInSidebar', 'textBox');
      });
      el.addEventListener('mouseover', function(e) {
        if (!menuIsInState(MENUSTATES.SELECT)) return;
        $whppt.mouseover(el);
      });
      el.addEventListener('mouseout', function(e) {
        $whppt.mouseout(el);
      });
    },
  });
};