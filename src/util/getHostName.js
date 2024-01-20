export default function getHostName() 
{
    if(import.meta.env.MODE === "development"){
        return "https://eventshanlder.onrender.com"
    }else{
        return "https://eventshanlder.onrender.com"
    }
}