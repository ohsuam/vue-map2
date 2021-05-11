import Vue from 'vue'
import Vuex from 'vuex'
import todoApp from './moduls/todoApp'

Vue.use(Vuex); // 전역 선언

export const store = new Vuex.Store({
    modules: {
        todoApp: todoApp
    },
    state : {
        lat : '',
        lng : '',
        Line : [],
        Name : [],
        bus : '',
        BusInfo : [],
        check : '',
    },
    getters : {
        getBus(state) {
            return state.bus;
        },
        getLat(state) {
            return state.lat;
        },
        getLng(state) {
            return state.lng;
        },
        getExitBus(state){
            return state.BusInfo;
        }
    },
    mutations : {
        changeLatLng (state, data) {
            state.lat = data.lat;
            state.lng = data.lng;
        },
        subLine(state, data) {
            state.Line.splice(0);
            for(var i=0;i<data.length;i++) {
                state.Line.push(data[i]);
            }
        },
        subName(state, data) {
            state.Name.splice(0);
            for(var i=0;i<data.length;i++) {
                state.Name.push(data[i]);
            }
        },
        bus(state, data) {
            state.bus = data.bus;
            state.lat = data.lat;
            state.lng = data.lng;
        },
        ExitBus(state, data) {
            state.BusInfo.splice(0);
            if(data !== 'undefined') {
                state.check = '1';
                for(var i = 0; i < data.length; i++){
                    state.BusInfo.push(data[i]);
                }
            } else {
                state.check = '';
            }
        }
    }
});