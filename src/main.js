import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Podcasts from "./components/Podcasts";
import Podcast from "./components/Podcast";
import About from "./components/About";
import axios from "axios";
import VueAxios from "vue-axios";
import Vuex from "vuex";
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueAxios, axios);
let router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", component: Podcasts },
    { path: "/podcasts", component: Podcasts },
    { path: "/about", component: About },
    { path: "/:id", component: Podcast },
    { path: "*", component: Podcasts }
  ]
});
var store = new Vuex.Store({
  state: {
    first: false,
    last: false,
    page: 1,
    podcasts: [],
    podcast: null
  },
  mutations: {
    LOAD_PODCAST(state, data) {
      state.podcast = data;
    },
    LOAD_PODCASTS(state, data) {
      state.podcasts = data.shows;
      state.first = data.first;
      state.last = data.last;
    }
  },
  actions: {
    loadPodcasts({ commit, state }) {
      axios
        .get(`https://jsnoise.herokuapp.com/api/showslist?page=${state.page}`)
        .then((response) => {
          console.log("vuex podcasts:", { data: response.data });
          commit("LOAD_PODCASTS", response.data);
        })
        .catch((err) => console.dir(err));
    },
    loadPodcast({ commit }, showId) {
      axios
        .get(`https://jsnoise.herokuapp.com/api/shows/${showId}`)
        .then((response) => {
          console.log("vuex podcast:", { data: response.data });
          commit("LOAD_PODCAST", response.data);
        })
        .catch((err) => console.dir(err));
    },
    prevPage({ commit, state, dispatch }) {
      if (state.first === true) return;
      state.page--;
      dispatch("loadPodcasts");
    },
    nextPage({ commit, state, dispatch }) {
      if (state.last === true) return;
      state.page++;
      dispatch("loadPodcasts");
    }
  }
});
Vue.config.productionTip = false;
Vue.filter("formatDate", function (dt) {
  if (dt && dt.indexOf("T") >= 0) return dt.split("T")[0];
});

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
