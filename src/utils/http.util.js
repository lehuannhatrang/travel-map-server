import Q from 'q';
import axios from 'axios';
import queryString from 'query-string';
import {createError, createInvalidRequestParamsError} from "../errors/Error";

class HttpUtil {

    //create http request
    static async makeHttpRequest(methodOriginal, urlOriginal, data, customHeaders) {
        var deferred = Q.defer();

        const method = methodOriginal.toLowerCase();
        let url = urlOriginal;
        let config = {
            method: method,
            url: url
        };

        if (data) {
            const paramsTxt = queryString.stringify(data);
            if (method === 'get' || method === 'delete')
                config['url'] = url + '?' + paramsTxt;
            else if (method === 'post' || method === 'put')
                config['data'] = data;
        }

        let headers = customHeaders;
        config['headers'] = headers;

        try {
            let retReq = await axios(config);
            if (Array.isArray(retReq.data) || retReq.status === 200)
                deferred.resolve(retReq.data);
            else
                deferred.reject(retReq.data);

        } catch (err) {
            deferred.reject(err);
        }

        return deferred.promise;
    }

    static makeJsonRequest(methodOriginal, urlOriginal, data, customHeaders) {
        let headers = { 'Content-type': 'application/json', 'Accept': 'application/json' };

        if (customHeaders) {
            for (var cusHead in customHeaders) {
                headers[cusHead] = customHeaders[cusHead];
            }
        }

        return HttpUtil.makeHttpRequest(methodOriginal, urlOriginal, data, headers);
    }

    //create http response
    static makeHttpResponse(res, data, code) {
        if (code) res.status(code);
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }

    //json response
    static makeJsonResponse(res, data) {
        if (!('errorMessage' in data) && !('message' in data) && !('status' in data))
            data['status'] = 'success';
        return res.json(data);
    }


    static makeErrorResponse(res, errorCode) {
        const err = createError(errorCode)
        return HttpUtil.makeHttpResponse(res, err, err.status);
    }

    // CRUD JSON

    static getJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('GET', path, data, headers);
    }

    static postJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('POST', path, data, headers);
    }

    static putJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('PUT', path, data, headers);
    }

    static deleteJson(path, data, headers) {
        return HttpUtil.makeJsonRequest('DELETE', path, data, headers);
    }

}

export default HttpUtil;