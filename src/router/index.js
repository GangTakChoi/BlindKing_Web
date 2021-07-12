import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "signup" */ '../views/Signup.vue')
  },
  {
    path: '/self-introduction',
    name: 'SelfIntroduction',
    component: () => import(/* webpackChunkName: "self-introduction" */ '../views/SelfIntroduction.vue')
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import(/* webpackChunkName: "friends" */ '../views/Friends.vue')
  },
  {
    path: '/matching',
    name: 'Matching',
    component: () => import(/* webpackChunkName: "matching" */ '../views/Matching.vue')
  },
  {
    path: '/matching/detail/:id',
    name: 'MatchingDetail',
    component: () => import(/* webpackChunkName: "matching-detail" */ '../views/MatchingDetail.vue')
  },
  {
    path: '/chatting-room/:friendObjectId',
    name: 'ChattingRoom',
    component: () => import(/* webpackChunkName: "chatting-room" */ '../views/ChattingRoom.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
