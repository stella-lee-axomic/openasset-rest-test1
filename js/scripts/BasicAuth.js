import axios from 'axios';
import {BASE_NOUN} from './Constants';


export default {
    /**
     * Key argument is set to true if passing session key
     * Accepts rest parameters. Must be in following order:
     * 0 oa url
     * 1 username
     * 2 password/session key
     */
    authenticate: function(key, ...credentials){

        let baseUrl = credentials[0] + BASE_NOUN;
        let authUserUrl = `Users?username=${credentials[1]}`;
        let fullUrl = baseUrl + authUserUrl;
        let config = {
            method: 'get'
        };

        if(key){
            let session = {'X-SessionKey': credentials[2]};
            config['headers'] = session;
        } else {
            let creds = {
                username: credentials[1],
                password: credentials[2]
            };
            config['auth'] = creds;
        }

        console.log('Axios config is ' + JSON.stringify(config));
        console.log('OA URL is ' + fullUrl);

        return axios.get(fullUrl, config).then(response => {
            console.log('Axios API request was successful');
            return {
                status: response.request.status,
                data: response.data,
                headers: response.headers
            };
        }).catch(error => {
            console.error('Axios API request failed');

            if(error.message && error.message === 'Network Error'){
                return {
                    data: {
                        error_message: `Not able to contact the OpenAsset 
                                        server at ${baseUrl}`,
                        http_status_code: 504
                    },
                    status: 504
                };
            } else {
                return {
                    data: error.response.data,
                    headers: error.response.headers,
                    status: error.response.request.status
                };
            }

        });

   }

}