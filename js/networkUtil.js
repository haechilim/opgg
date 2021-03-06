class NetworkUtil {
    constructor() {}

    static request(url, method, send, callback) {
        let xmlHttpRequest = new XMLHttpRequest();
    
        xmlHttpRequest.addEventListener("load", () => {
            let json = JSON.parse(xmlHttpRequest.responseText);
            
            if(callback) callback(json);
        });
    
        xmlHttpRequest.open(method, url, true);
        xmlHttpRequest.send(send);
    }

    static getParameters() {
        let result = {};
        let part = parameterPart();
        let parameters = part.split("&");
        
        for(let i = 0; i < parameters.length; i++) {
            let tokens = parameters[i].split("=");
            
            if(tokens.length < 2) continue;
            
            result[tokens[0]] = tokens[1];
        }
        
        return result;
        
        function parameterPart() {
            let tokens = location.search.split("?");
            
            return tokens.length > 1 ? tokens[1] : "";
        }
    }
}

export default NetworkUtil;