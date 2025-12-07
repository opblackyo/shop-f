/**
 * UGC 短影音路由模組
 */

const ugcRoutes = [
  {
    path: '/ugc',
    name: 'UGCFeed',
    component: () => import('@/views/ugc/UGCFeed.vue'),
    meta: {
      title: '短影音',
      hideNav: true  // 隱藏導航列（全螢幕播放）
    }
  }
]

export default ugcRoutes

