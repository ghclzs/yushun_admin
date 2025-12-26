import Vue from "vue";

const state = Vue.observable({
    searchValue: "",
    // 当前页面: 'list' | 'verify' | 'report'
    currentPage: "list"
});

export default {
    state,
    // 设置搜索框的值
    setSearchValue(value) {
        state.searchValue = value;
    },
    // 获取搜索框的值
    getSearchValue() {
        return state.searchValue;
    },
    // 设置当前页面
    setCurrentPage(page) {
        state.currentPage = page;
    },
    // 获取当前页面
    getCurrentPage() {
        return state.currentPage;
    }
};