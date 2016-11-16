class AppConfig {
    // static API_DOMAIN = 'coursiers-velo.xyz';
    static API_DOMAIN = 'coursiers2.dev';
    static API_BASEURL = 'http://' + AppConfig.API_DOMAIN;
    static WEBSOCKET_BASEURL = 'ws://' + AppConfig.API_DOMAIN;
}

module.exports = AppConfig;