import { error } from "console";
import { DEVELOPMENT_MODE } from "./config";

let server_address: string;
if (DEVELOPMENT_MODE) {
    server_address = "http://localhost:3100/";
} else {
    server_address = "https://email-writer-server-9.onrender.com/";
}
console.log(server_address);
export async function getCompletion(
    prompt: string,
    maxTokens: number = 10,
    temperature: number = 0.7,
    auth_header: string
): Promise<Response> {
    let url = server_address + "email-completion/";
    const query = `?prompt=${prompt}&maxTokens=${maxTokens}&temperature=${temperature}`;
    url += query;

    const response = await fetchWithErrorHandling(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer: ${auth_header}`,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export async function getEditCompletion(email: string, changes: string, maxTokens: string, temperature: string, auth_header: string): Promise<Response> {
    let url = server_address + "email-edit-completion/";
    const query = `?email=${email}&changes=${changes}&maxTokens=${maxTokens}&temperature=${temperature}`;
    url += query;

    const response = await fetchWithErrorHandling(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer: ${auth_header}`,
            "Content-Type": "application/json",
        },
    });
    return response;
}

export async function fetchWithErrorHandling(url: string, options: any): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        return response;
    } catch (error) {
        console.log(error);
        // document.querySelector("#Output_Field").textContent = "Error: " + error;
        throw error;
    }
}

export async function login(username: string, password: string): Promise<string> {
    console.log("Logging in...");
    const auth = JSON.stringify({ username, password });
    const url = server_address + "login";

    const response = await fetchWithErrorHandling(url, {
        method: "POST",
        body: auth,
        headers: {
            "Content-Type": "application/json",
        },
    });
    try {
        const { token } = await response.json();
        if (!response.ok) {
            throw new Error("Network response was not ok.");
        }
        console.log("Logged in successfully.");
        return token;
    } catch (error) {
        console.error("Failed to log in:", error);
        // Display an error message
        // alert(`Failed to log in: ${error}`);
        throw error;
    }

}
