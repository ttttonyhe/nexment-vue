import NexmentContainer from './components/container/index.vue';

const Nexment = {
  install: function(Vue: { component: (arg0: string, arg1: any) => void }) {
    Vue.component('NexmentContainer', NexmentContainer);
  },
};

export default Nexment;
