import axios from "axios";

const base_url = "http://chinh.winwingroup.vn/api/";

const request_url = async ({ url, method, data,token }) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
    login: () => "user/login", // Relative URL path, base_url will be prepended in request_url function
};

export { request_url, apis };
