import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/modelerDefault',
    name: 'modelerDefault',
    component: ()=> import('@/components/DefaultModeler.vue'),
  },
  {
    path: '/viewerDefault',
    name: 'viewerDefault',
    component: ()=> import('@/components/DefaultViewer.vue'),
  },
  {
    path: '/customModeler',
    name: 'customModeler',
    component: ()=> import('@/components/CustomModeler.vue'),
  },
  {
    path: '/customViewer',
    name: 'customViewer',
    component: ()=> import('@/components/CustomViewer.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
