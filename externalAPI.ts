import axios from "axios";
import process from "node:process";
import "dotenv/config";


let myCity =  "";
for (let i = 2; i < process.argv.length; i++) myCity += process.argv[i]; 
const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${myCity}`;
const controller = new AbortController();

type weatherForecast = {
    resolvedAddress: string,
    timezone: string,
    description: string,
    days: {
        datetime: string,
        temp: number,
        humidity: number,
        windspeed: number, 
        conditions: string,
        description: string
    }[]
}

const timeout = setTimeout(() => {
    controller.abort();
}, 5000)

const httpRequest = async () => {
    try {
        const response = await axios.get(URL, {
            params: {
                key: process.env.API_KEY,
                unitGroup: "metric"
            },
            signal: controller.signal
        });


        const data = await response.data as weatherForecast;
        console.log(data.timezone);
    }
    catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
            console.log("Getting data makes too much time!");
            return;
        }

        if (axios.isAxiosError(err) && err.response) {
            console.log("Fault from server: ", err.response.status);
            return;
        }

        if (axios.isAxiosError(err) && err.request) {
            console.log("Fault from client: ", err.request.status);
            return;
        }

        const mess = err instanceof Error ? err.message : "uknown error";
        console.log(mess);
    }
    finally {
        console.log("Done");
    }
}

httpRequest();
