class AppConfig {
    static SSL = false;
    static API_DOMAIN = 'coopcycle.dev';
    static API_BASEURL = (AppConfig.SSL ? 'https' : 'http') + '://' + AppConfig.API_DOMAIN;
    static WEBSOCKET_BASEURL = (AppConfig.SSL ? 'wss' : 'ws') + '://' + AppConfig.API_DOMAIN;
}

module.exports = AppConfig;