module.exports = {
    devServer: {
        proxy: {
            '/openapi': {
                    // 프록시 요청을 보낼 서버의 주소
                    target: 'http://openapi.tago.go.kr'
            }
        },
        overlay: false
    },
    //outputDir: './docs',
    //publicPath : '/ohsuam.vueproject.io'
}