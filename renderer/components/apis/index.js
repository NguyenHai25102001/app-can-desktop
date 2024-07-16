import axios from "axios";

const base_url = "http://chinh.winwingroup.vn/api/";

const request_url = async ({ url, method, data,token }) => {

    try {
        const headers = {
            "Content-Type": "application/json",
            "token": `${token}`,
        };
        const config = { method, url: base_url + url, data, headers };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error("Request error:", error);
        throw error;
    }
};

const apis = {
    login: () => "user/login",
    listCustomer: () => "info_scale/supplier",
    electronic_scale: () => "electronic_scale",
    store_electronic_scale:()=> "store_electronic_scale",
    update_electronic_scale:()=> "update_electronic_scale",
    complete_electronic_scale:()=> "complete_electronic_scale",
    
};

export { request_url, apis };
