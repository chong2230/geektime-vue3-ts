<template>
    <div class="page index-page">
        <Header :menus="menus" />
        <div class="main row">
            <div class="left column">
                <div class="explore">
                    <div class="top row">
                        <div class="title">{{lecturePath.block_title}}</div>
                        <div class="view-all">查看全部</div>
                    </div>
                    <ul class="row">
                        <li class="row" v-for="item in lecturePath.list" :key="item.id" @click="goLecture(item.redirect_param)">
                            <div class="lecture-info">
                                <div class="name">{{item.name}}</div>
                                <div class="desc">{{item.product_count}}门课程</div>
                            </div>
                            <img class="lecture-img" :src="item.icon" />
                        </li>
                    </ul>
                </div>
                <div class="types-sec column" :class="isHover ? 'hover' : ''" @mouseover="enter(event)" @mouseout="leave(event)" v-if="labels.length > 0">
                    <div class="type-item">
                        <span>形式：</span>
                        <div class="type-labels row">
                            <a class="all label" :class="curType == 0 ? 'choose' : ''" href="javascript:void(0)" @click="chooseType(0)">全部</a>
                            <a class="label" :class="curType == item.id ? 'choose' : ''" v-for="item in types" :key="item.id" 
                                href="javascript:void(0)" @click="chooseType(item.id)">{{item.name}}</a>                            
                        </div>
                    </div>
                    <div class="type-item row">
                        <span>方向：</span>
                        <div class="type-labels row">
                            <a class="all label" :class="curDirection == 0 ? 'choose' : ''" href="javascript:void(0)" @click="chooseDirection(0)">全部</a>
                            <!-- <div class="label" v-for="item in lectureTag.list" :key="item.id">{{item.title}}</div> -->
                            <a class="label" :class="curDirection == item.lid ? 'choose' : ''" v-for="item in labels.filter((val)=> val.pid==0)" :key="item.lid" 
                                href="javascript:void(0)" @click="chooseDirection(item.lid)">{{item.name}}</a>
                        </div>
                    </div>
                    <div class="type-item row">
                        <span>分类：</span>
                        <div class="type-labels row">
                            <a class="all label" :class="curCategory == 0 ? 'choose' : ''" href="javascript:void(0)" @click="chooseCategory(0)">全部</a>
                            <a class="label" :class="curCategory == item.lid ? 'choose' : ''" v-for="item in labels.filter((val)=>{return val.pid!=0})" :key="item.lid" 
                                href="javascript:void(0)" @click="chooseCategory(item.lid)">{{item.name}}</a>
                        </div>
                    </div>
                </div>
                <div class="products">
                    <div class="products-info row">
                        <div class="conditions row">
                            <a class="row" :class="{active: index == order - 1}" href="javascript:void(0)" 
                                v-for="(item, index) in conditions" :key="index" @click="changeSku(index)">
                                {{item}}
                                <span class="column" v-if="index == 3">
                                    <i class="up" :class="{active: order==4 && asc==1}"></i>
                                    <i class="down" :class="{active: order==4 && asc==0}"></i>
                                </span>
                            </a>
                        </div>
                        <span class="count" v-if="skusData.page">{{skusData.page.count}}个课程</span>
                    </div>
                    <Product :productInfos="productInfos" :productArticles="productArticles"></Product>
                </div>
            </div>
            <div class="right">
                <div class="content">
                    <div class="my-course">
                        <button class="course-btn btn" @click="goMyCourse">我的课程</button>
                    </div>
                    <ExploreBanner :exploreBanner="exploreBanner"></ExploreBanner>
                    <LectureAd :lectureAd="lectureAd"></LectureAd>                    
                    <IndexLive :indexLive="indexLive"></IndexLive>
                    <AdMall :mall="mall"></AdMall>                    
                    <AttentionUs></AttentionUs>
                </div>
            </div>
        </div>   
        <AdBottom :adBottom="adBottom"></AdBottom>    
        <ad-dialog ref="adDialog" :src="ad.image_url" :link="ad.target_url"></ad-dialog>             
    </div>
</template>
<script lang="ts">
import { reactive, ref, onMounted, onUpdated, onUnmounted } from 'vue'
import { getCurrentInstance, toRefs } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue';
import Product from './components/Product.vue';
import ExploreBanner from './components/ExploreBanner.vue';
import LectureAd from './components/LectureAd.vue';
import IndexLive from './components/IndexLive.vue';
import AdMall from './components/AdMall.vue';
import AttentionUs from './components/AttentionUs.vue';
import AdBottom from './components/AdBottom.vue';
import Mock from '@/mock/index';
import AdDialog from './components/AdDialog.vue';
import { getSkuIds, getSkusByOrder } from './skus'
import { debounce, getLink } from '@/common/util';
import api from '@/common/api'
// import skus from '@/mock/labelSkus.js';

export default {
    components: {
        Header,
        Product,
        ExploreBanner,
        LectureAd,
        IndexLive,
        AdMall,
        AttentionUs,
        AdBottom,
        AdDialog
    },
    setup() {
        // const { ctx } = getCurrentInstance();
        const router = useRouter();        
        const state = reactive({
            menus: [],
            lecturePath: {},    // 学习路径
            lectureTag: {},     // 课程方向
            exploreBanner: {},   // 热门推荐
            lectureAd: {},      // 活动推荐
            hotLive: {},        // 极客Live
            indexLive: {},      // 当前Live
            mall: {},           // 商城上新
            adBottom: {},       // 底栏
            lecture: {},
            productInfos: [],
            productArticles: {},
            skusData: {},
            conditions: ['综合', '最新上架', '订阅数', '价格', '活动'],
            order: 1,            // 排序 1：综合 2：最新上架 3：订阅数 4：价格 5：活动
            asc: 1,               // 1：升序 0：降序 用于价格排序
            ad: {},              // 广告弹窗
            types: ['专栏', '视频课程', '微课', '每日一练', '大厂案例'],
            labels: [],
            isHover: false,
            curType: 0,      // 选择形式
            curDirection: 0, // 选择方向
            curCategory: 0,  // 选择类别
        });
        let skusObj: any = {};   // 缓存skus
        let skus: any = [];
        let page = 1, pageSize = 10;

        // 监听滚动，翻页
        window.onscroll = debounce(function() {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if (scrollTop + windowHeight >= scrollHeight - 40) {
                page++;
                getProductInfos();
            }

        });
        
        onMounted(async () => {
            loadData();     
        })

        function loadData() {
            getMenus();
            getExploreAll(); 
            getLabels();       
            getLabelSkus();
            // getLectureList();
            getIndexLive(); 
            getPcInterstitial();
        }        

        async function getMenus() {
            const menus = await api.getMenuData({v: 26939623});
            state.menus = menus;
        }

        async function getExploreAll() {
            let res = await api.getExploreAll({page: "lecturev2_web"});
            // use mock data, why no data?
            if (res.data && res.data.length == 0) {
                res = Mock['/serv/v2/explore/all'];
            }
            if (res.code == 0) {                
                let explores = res.data;
                for (let item of explores) {
                    if (item.block_name == 'lecture_path') {item.list = item.list.slice(0, 4);state.lecturePath = item;}
                    else if(item.block_name == 'cm_lecture_tag') state.lectureTag = item;
                    else if(item.block_name == 'explore_banner') state.exploreBanner = item;
                    else if(item.block_name == 'cm_web_lecture_ad001') state.lectureAd = item;
                    else if(item.block_name == 'hot_live') state.hotLive = item;
                    else if(item.block_name == 'cm_web_lecture_ad002') state.mall = item;
                    else if(item.block_name == 'ad_bottom') {state.adBottom = item.list[0];}
                }
            }
        }

        async function getLabels() {
            const res = await api.getLabels({type: state.curType});
            if (res.code == 0) {
                state.types = res.data.nav;
                state.labels = res.data.labels;
            }
        }

        // TODO: save skus data, if exist, don't request again, maybe params lost when in proxy server
        async function getLabelSkus(params?: object | null) {
            const res = await api.getLabelSkus(params || {label_id: 0, type: state.curType});
            if (res.code == 0) {
                state.skusData = res.data;
                if (!skusObj[state.order]) skusObj[state.order] = getSkusByOrder(state.skusData, state.order, state.asc);
                skus = skusObj[state.order];                
                getProductInfos();
            }
        }
        
        async function getLectureList() {
            const res = await api.getLectureList({label_id: 0, type: 0});
            if (res.code == 0) {
                state.lecture = res.data;
            }
        }    
        
        async function getIndexLive() {
            const res = await api.getIndexLive({});
            if (res.code == 0) {
                state.indexLive = res.data;                
            }
        }

        async function getProductInfos() {
            let ids = getSkuIds(skus, page, pageSize);
            const params = {
                ids: ids,//[100015201, 100052401, 100073301, 100073201, 100003101, 100002201, 100001901, 100007001, 100003901, 100006201],
                with_first_articles: true

            }
            const res = await api.getProductInfos(params);
            if (res.code == 0) {
                let data = res.data;
                let articles: any = {};
                for (let article of res.data.articles) {
                    articles[article.pid] = articles[article.pid] || [];
                    articles[article.pid].push(article);
                }
                state.productInfos = state.productInfos.concat(data.infos);
                state.productArticles = Object.assign({}, state.productArticles, articles);
            }
        }

        async function getPcInterstitial() {
            const res = await api.getPcInterstitial({v: 26939623});
            const ads = res.default || [];
            let date: Date = new Date();
            let ts: number = date.getTime();
            let time: number = ts/1000;
            let ad = {};
            for (let item of ads) {
                if (time >= item.start_time_timestamp && time <= item.end_time_timestamp) {
                    ad = item;
                    break;
                }
            }
            // 根据v获取json文件，v还不知道如何获取，取v=26939623的最后一条数据
            if (JSON.stringify(ad) == '{}') ad = ads[ads.length - 1] || {};
            state.ad = ad;
        }

        const goLecture = (link: string) => {
            window.open(getLink(link), '_blank');
        }

        const changeSku = (index: number) => {
            if (state.order == 4 && index == 3) state.asc = 1 - state.asc;  // 重复点击价格，切换升序和降序
            else if (state.order - 1 == index) return;
            else state.asc = 1;
            state.order = index + 1;
            let key: string = state.order.toString();
            if (key == '4') {
                // 价格分为升序和降序
                key += '-' + state.asc;
            }
            if (!skusObj[key]) skusObj[key] = getSkusByOrder(state.skusData, state.order, state.asc);
            skus = skusObj[key];
            page = 1;            
            state.productInfos = [];
            state.productArticles = {};
            getProductInfos();
        }

        const enter = () => {
            state.isHover = true;
        }

        const leave = () => {
            state.isHover = false;
        }

        const chooseType = (val: number) => {
            state.curType = val;
            getLabels();   
            skusObj[state.order] = null;    
            getLabelSkus();
        }

        const chooseDirection = (val: number) => {
            state.curDirection = val;
            skusObj[state.order] = null;
            getLabelSkus({label_id: state.curDirection, type: state.curType});
        }

        const chooseCategory = (val: number) => {
            state.curCategory = val;
            skusObj[state.order] = null;
            getLabelSkus({label_id: state.curCategory, type: state.curDirection});
        }

        const goMyCourse = () => {
            // const router = useRouter(); // 写在这里router为undefined
            // router.push('/login')
            location.href = '/account/';    // 多页应用
        }

        onUpdated(() => {
            console.log('onUpdated')
        })

        onUnmounted(() => {
            console.log('onUnmounted')
        })
        
        return {
            ...toRefs(state),
            goLecture,
            changeSku,
            enter,
            leave,
            chooseType,
            chooseDirection,
            chooseCategory,
            goMyCourse
        };
    },
}
</script>
<style lang="scss">
.explore-banner {
    .title {
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #404040;
        text-align: left;
    }
    .banner-box {
        position: relative;
        width: 100%;
        height: 129px;
        border-radius: 5px;
        overflow: hidden;
        
        .explore-banner-swiper {
            height: 129px;
            border-radius: 5px;
            
        }

        .link-box {
            display: block;
            width: 305px;
            height: 100%;
            position: relative;
            overflow: hidden;
            cursor: pointer;

            img {
                width: 100%;
                position: relative;
            }
        }
    }
    
}
</style>
<style lang="scss" scoped>
.page {
    min-width: 1200px;
    margin-top: 60px;
}
.main {
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    width: 1080px;
    margin: 0 auto 60px;
    padding-top: 50px;
    .left {
        
        .products {
            margin-top: 30px;
            width: 711px;
            
        }
    }
    .right {
        width: 305px;
        padding-bottom: 50px;        
    }
}
.explore {
    margin-bottom: 26px;
    .top {
        justify-content: space-between;
        padding-right: 8px;
        .title {
            font-size: 16px;
            font-weight: 500;
            color: #353535;
        }
        .view-all {
            font-size: 13px;
            font-weight: 400;
            color: #888;
            cursor: pointer;
        }
    }
    ul {
        margin-top: 12px;
        li {
            position: relative;
            justify-content: space-between;
            width: 171px;
            height: 56px;
            padding: 0 13px 0 10px;
            margin-right: 9px;
            vertical-align: top;
            background: #f6f7fa;
            border-radius: 5px;
            box-sizing: border-box;
            cursor: pointer;            
        }
    }
}
.lecture-info {
    height: 32px;
    .name {
        width: 112px;
        line-height: 18px;
        font-size: 14px;
        font-weight: 500;
        color: #353535;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        transition: color 0.2s ease;
    }
    .desc {
        margin-top: -3px;
        margin-left: -11px;
        font-size: 13px;
        font-weight: 400;
        color: #888;
        transform: scale(0.8);
    }
}
.lecture-img {
    position: relative;
    z-index: 10;
    width: 36px;
    height: 36px;
    border-radius: 5px;
    object-fit: cover;
}
.my-course {
    display: flex;
    flex: 0 0 110px;
    justify-content: flex-end;
    margin-bottom: 20px;
    .course-btn {
        margin-right: 12px;
        width: 120px;
    }                    
}
.products-info {
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid rgba(233,233,233,0.6);
    .conditions {
        display: flex;
        a.active {
            font-weight: 500;
            color: #666565;

        }
        a {
            color: #888;
            padding-right: 20px;
            font-size: 13px;
            font-weight: 400;
            margin-right: 20px;
            position: relative;
            span {
                width: 8px;
                height: 13px;
                margin-left: 5px;
            }
            .up {
                border-bottom: 4px solid #b2b2b2;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                width: 0;
                height: 0;
                margin-bottom: 2px;
                &.active {
                    border-bottom: 4px solid #fa8919;
                }
            }
            .down {
                border-top: 4px solid #b2b2b2;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                width: 0;
                height: 0;
                &.active {
                    border-top: 4px solid #fa8919;
                }
            }
        }
    }
    .count {
        font-size: 12px;
        color: #888;
        font-weight: 400;
    }
}
.types-sec {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 711px;
    min-height: 180px;;
    box-sizing: border-box;
    border-radius: 2px;
    box-shadow: 0px 2px 10px 0px rgb(46 61 72 / 5%);
    .type-item {
        margin-top: 14px;
        display: flex;
        align-items: baseline;
        position: relative;
        z-index: 10;
        padding: 0 20px;
        max-height: 74px;
        overflow: hidden;
        .type-labels {
            flex-wrap: wrap;
            a:hover {
                color: $baseColor;
            }
        }
        span {
            min-width: 50px;
            padding-top: 4px;
            font-size: 14px;
            font-weight: 500;
            color: #353535;
        }
        .label {
            position: relative;
            margin-right: 5px;
            margin-bottom: 12px;
            padding: 0 12px;
            height: 22px;
            line-height: 22px;
            font-size: 14px;
            font-weight: 400;
            border-radius: 14px;
            color: #888;
            white-space: nowrap;
        }
        .choose {
            font-weight: 500;
            // color: #fa8919;
            color: $baseColor;
            background: #fbf5ee;
        }
    }
}
.types-sec.hover {
    .type-item {
        max-height: unset;
    }    
}

</style>