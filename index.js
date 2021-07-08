const http=require("http");
const fs=require("fs");
var requests=require("requests");

const homeFile=fs.readFileSync("Home.html","utf-8");
const replaceval=(tempVal, orgval)=>{
  let temperature= tempVal.replace("{%tempval%}", orgval.main.temp);
     temperature= temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature= temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature= temperature.replace("{%location%}", orgval.name);
     temperature= temperature.replace("{%country%}", orgval.sys.country);
     temperature=temperature.replace("{%tempstatus%}", orgval.weather[0].main);
      return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url="/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Karachi&units=metric&appid=4747055628ccc05338d00b0e1af89da8")
.on('data', (chunk)=> {
    const objdata=JSON.parse(chunk);
    const arrData=[objdata];
  //console.log(Math.round(arrData[0].main.temp-275));
  const realtimeData=arrData.map((val)=>
    replaceval(homeFile, val)).join("");
    res.write(realtimeData);
})
.on('end', (err) =>{
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
    
    }
});
server.listen(8000,"127.0.0.1");