import http from './http'
import Config from '../config/config'

const api: any = {}

api.getMenuData = (params?: object | null) => http.get('/static/time/menu/data.json', params, { baseUrl: Config.staticServer })
api.getExploreAll = (params?: object | null) => http.post('/serv/v2/explore/all', params);
api.getAuth = (params?: object | null) => http.post('/serv/v1/user/auth', params, { baseUrl: Config.accountServer });
api.getHotWords = (params?: object | null) => http.post('/serv/v3/search/hot_words', params);
api.getLectureList = (params?: object | null) => http.post('/serv/v3/lecture/list', params);
api.getIndexLive = (params?: object | null) => http.post('/serv/live/get_index_live', params);
api.getProductInfos = (params?: object | null) => http.post('/serv/v3/product/infos', params);
api.getLabels = (params?: object | null) => http.post('/serv/v1/column/labels', params);
api.getLabelSkus = (params?: object | null) => http.post('/serv/v1/column/label_skus', params);
api.getPcInterstitial = (params?: object | null) => http.get('/static/time/interstitial/pc_interstitial.json', params, { baseUrl: Config.staticServer })
api.getColumnIntro = (params?: object | null) => http.post('/serv/v1/column/intro', params);
api.getColumnArticles = (params?: object | null) => http.post('/serv/v1/column/articles', params);
api.getColumnChapters = (params?: object | null) => http.post('/serv/v1/chapters', params);
api.getColumnRecommend = (params?: object | null) => http.post('/serv/v3/column/recommend', params);

export default api;