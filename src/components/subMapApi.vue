<template>
  <div id="app">
    <form class="item2">
      <div>
        역명을 입력해주세요 : 
        <input type="text" id="subName" v-model="subName" @keyup.enter="getData">
        &nbsp;
        <button @click.prevent="getData">검색</button>
        &nbsp;

        <select id="lineResult" v-model="lineSelected">
          <option>=======선택=======</option>
          <option v-for="(d, i) in lineOptions" :key="i"> {{ d.Line }} </option>
        </select>
        &nbsp;

        <select id="nameResult" v-model="nameSelected">
          <option>=======선택=======</option>
          <option v-for="(d, i) in nameOptions" :key="i"> {{ d.Name }} </option>
        </select>
        &nbsp;


        <button name = "lookUp" @click.prevent="lookUp()">조회</button>
      </div>
    </form>
    
    <br>
    <div id="mapBus">
      <div id="map"></div>
      <div id="bus">
        <span>
          지하철명 : {{ getBus }} <br><br>
          <span style = "font-weight:bold"> - 주변 버스 정보 - </span> <br><br>
          <span v-if="$store.state.check === ''"> API에 버스정보가 존재하지 않습니다. </span>
          <span v-else>
            <span v-for="(d, i) in getExitBus" :key="i"> 출구번호 : {{ d.exitNum }}번, 버스번호 : {{ d.busNo }} <br> </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import subway from './subway.json';
import { mapGetters } from 'vuex';
var count = 0;

export default {
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
        const script = document.createElement('script');
        script.onload = () => kakao.maps.load(this.initMap);
        script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=3d6b15c296908a2805ecca5bd5e0695a';
        document.head.appendChild(script);
    }
  },
  data() {
    return {
      lineOptions : [
        { line : this.$store.state.Line }
      ],
      nameOptions : [
        { name : this.$store.state.Name }
      ],
      lineSelected : '',
      nameSelected : '',
      subName : '',
      busExit : [
        { busNo : this.$store.state.BusInfo }
      ]
    }
  },
  methods: {
    initMap() {
      var lat = this.$store.state.lat;
      var lng = this.$store.state.lng;
      
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
      };

      var map = new kakao.maps.Map(container, options);
      map.addOverlayMapTypeId(kakao.maps.MapTypeId.TRAFFIC);

      var moveLatLon = new kakao.maps.LatLng(lat, lng);

      map.setCenter(moveLatLon);

      var MarkerPosition = new kakao.maps.LatLng(lat, lng);

      var marker = new kakao.maps.Marker({
        position : MarkerPosition
      });

      marker.setMap(map);
    },
    getData() {
      var vm = this;
      
      axios.get('/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey=ZjT1Hmhjxa3jeVJU8GnEayvLn37Q4IAPHSQj0E4q419b5yPtcw0Fnxz%2BAwmRGP21Tn5awBSLYSAerf51x9FeTg%3D%3D&subwayStationName='+vm.subName)
      .then(function(resp) {
        vm.lineOptions.splice(0);
        vm.nameOptions.splice(0);
        count = 0;
        
        for(var i=0; i<resp.data.response.body.items.item.length; i++) {
          vm.lineOptions.push({
            Line : resp.data.response.body.items.item[i].subwayRouteName
          });
          
          vm.nameOptions.push({
            Name : resp.data.response.body.items.item[i].subwayStationName

          });
          count++;
        }
        console.log(vm.subName);

        vm.$store.commit('subLine', vm.lineOptions);
        vm.$store.commit('subName', vm.nameOptions);
        
        if(count === 0) {
          alert("검색된 지하철이 없습니다.");
        } else {
            alert("검색 된 지하철의 수 : " + count + "개");
            console.log("검색 된 지하철의 수 : " + count + "개");
        }
      }).catch(function(error) {
        console.log(error);
      });
    },
    lookUp() {
      console.log("조회한 지하철 명 : " + this.lineSelected + " " + this.nameSelected + "역"); // select 선택된 값의 역 불러오기
      var vm = this;
      var subLine = this.lineSelected;
      var subName = this.nameSelected+"역";

      var stationId = '';
      axios.get('/openapi/service/SubwayInfoService/getKwrdFndSubwaySttnList?serviceKey=ZjT1Hmhjxa3jeVJU8GnEayvLn37Q4IAPHSQj0E4q419b5yPtcw0Fnxz%2BAwmRGP21Tn5awBSLYSAerf51x9FeTg%3D%3D&subwayStationName='+this.subName)
      .then(function(resp) {
        for(var i=0; i<resp.data.response.body.items.item.length; i++){
          if(resp.data.response.body.items.item[i].subwayRouteName === subLine) {
            if(resp.data.response.body.items.item[i].subwayStationName === subName || subName+"역") {
              stationId = resp.data.response.body.items.item[i].subwayStationId;
            }
          }
        }
        console.log("지하철 역 ID명 : " +stationId);
        


        // 버스 불러오는 API
        axios.get('/openapi/service/SubwayInfoService/getSubwaySttnExitAcctoBusRouteList?serviceKey=ZjT1Hmhjxa3jeVJU8GnEayvLn37Q4IAPHSQj0E4q419b5yPtcw0Fnxz%2BAwmRGP21Tn5awBSLYSAerf51x9FeTg%3D%3D&subwayStationId='+stationId)
        .then(function(resp2) {
          var BusInfo;
          var BusInfo2 = [];
          for(var i=0; i<resp2.data.response.body.items.item.length; i++) {
            var exitNum = resp2.data.response.body.items.item[i].exitNo;
            var busNo = resp2.data.response.body.items.item[i].busRouteNo;
            BusInfo = { exitNum : exitNum, busNo : busNo };
            BusInfo2[i] = BusInfo;
          
            if(i == (resp2.data.response.body.items.item.length) - 1) {
              console.log(BusInfo2);
              vm.$store.commit('ExitBus', BusInfo2);
            }
          }
        }).catch(function(error){
          vm.$store.commit('ExitBus', 'undefined');
          console.log(error);
        });



      }).catch(function(error) {
        console.log(error);
      });
      

      var lat, lng;


      for(var i=0; i<subway.data.length; i++) {
        if(subway.data[i].Line === subLine && subway.data[i].Name === subName) {
          lat = subway.data[i].lat;
          lng = subway.data[i].lng;
          this.$store.commit('bus', {bus : this.nameSelected, lat : lat, lng : lng} );
          console.log(subway.data[i]);
        }
      }



      if(lat === undefined && lng === undefined) {
        console.log("no");
        lat = 35.1746674;
        lng = 129.1279549;
      }



      var container = document.getElementById('map');

      var options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
      };

      var map = new kakao.maps.Map(container, options);

      var moveLatLon = new kakao.maps.LatLng(lat, lng);

      map.setCenter(moveLatLon);

      var MarkerPosition = new kakao.maps.LatLng(lat, lng);

      var marker = new kakao.maps.Marker({
        position : MarkerPosition
      });

      marker.setMap(map);
    }
  },
  created() {
    navigator.geolocation.getCurrentPosition(pos => {
      var lat = pos.coords.latitude;
      var lng = pos.coords.longitude;

      this.$store.commit('changeLatLng', {lat : lat , lng : lng} );
    })
  },
  computed : {
    ...mapGetters(['getBus']),
    ...mapGetters(['getLat']),
    ...mapGetters(['getLng']),
    ...mapGetters(['getExitBus'])
  }
}
</script>

<style>
  @keyframes text-in {
    0% {
      transform: translate(0, -20px);
      opacity: 0;
    }
  }

  .item2 {
    display: inline-block;
    min-width: 0.3em;
    animation: text-in .8s cubic-bezier(0.22, 0.15, 0.55, 1.43) 0s backwards;
    margin-bottom : 30px;
  }

  select {
    width: 80px;
    padding: .5em .5em;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
 
  #subName {
    width: 80px;
    padding: .5em .5em;
  }

  #result {
    width : 150px;
  }

  #map{
    width: 600px;
    height: 500px;
    border: 1px solid black;
    animation: text-in .8s cubic-bezier(0.22, 0.15, 0.55, 1.43) 0s backwards;
    float : left;
  }

  #bus {
    width : 600px;
    height : 200px;
    margin: 0 auto;
    float : right;
    animation: text-in .8s cubic-bezier(0.22, 0.15, 0.55, 1.43) 0s backwards;
  }

  #mapBus {
    display : inline-block;
    margin-bottom : 30px;
  }
</style>