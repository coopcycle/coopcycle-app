import AppConfig from './AppConfig.json'

module.exports = {
    ...AppConfig,
    API_BASEURL: AppConfig.BASE_URL,
    WEBSOCKET_BASEURL: AppConfig.BASE_URL.replace('http', 'ws')
};
