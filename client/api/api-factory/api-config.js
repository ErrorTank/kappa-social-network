import {sendRequest} from "./ajax-config";
import forIn from "lodash/forIn";

export const apiFactory = {
  createApi: ({hostURL, beforeSend, onErrors = {}}) => {
    let headers = {

    };
    let onError = (json) => {
      if(json && json.hasOwnProperty("message")){
        let key = json['message'];
        if(onErrors.hasOwnProperty(key)){
          onErrors[key]();
        }
      }
      if(onErrors.hasOwnProperty("default")){
        onErrors.default();
      }
    };
    const withPayload = method => (url, data) => {
      return sendRequest({
        url: hostURL + url,
        data,
        type: method,
        beforeSend,
        headers,
        onError
      });
    };
    const withoutPayload = method => url => {
      return sendRequest({
        url: hostURL + url,
        type: method,
        beforeSend,
        headers,
        onError
      });
    };

    return {
      addHeader: (key, getHeader) => {
        headers[key] = getHeader;
      },
      get: withoutPayload("GET"),
      post: withPayload("POST"),
      put: withPayload("PUT"),
      delete: withoutPayload("DELETE"),
      downloadStream(url) {
        window.open(hostURL + url);
      },
      postMultipart: (url, data, fileKey) => {
        let formData = new FormData();
        forIn(data, (value, key)=>{
          if (value != null) {
            if(key === fileKey && Array.isArray(value)){
              for(let i =0 ;i < value.length; i++){
                formData.append(key, value[i]);
              }

            }else
              formData.append(key, value);
          }
        });

        return new Promise((resolve, reject)=>{
          $.ajax({
            url: hostURL + url,
            type: 'POST',
            beforeSend: (xhr) => {
              if (headers && Object.keys(headers).length) {
                Object.keys(headers).map((each) => {
                  let val = typeof headers[each] === "function"  ? headers[each]() : headers[each];
                  xhr.setRequestHeader(each, val)
                });
              }
              if(beforeSend){
                beforeSend(xhr);
              }
            },
            data: formData,
            cache: false,
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            success: (data) => {
              resolve(data);
            },
            error: (rsp, status, error) => {
              reject({rsp: rsp.responseJSON}, status, error);
            }
          });
        });
      },
    }
  }
};
