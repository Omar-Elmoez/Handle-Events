export default function getHostName() 
{
    if(import.meta.env.MODE === "development"){
        return "http://localhost:3000"
    }else{
        return "https://eventshanlder.onrender.com"
    }
}