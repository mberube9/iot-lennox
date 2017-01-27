var username = process.env['LENNOX_USER'],
    password = process.env['LENNOX_PASSWORD'],
    gatewaysn = process.env['LENNOX_GATEWAYSN']
    api_url = process.env['LENNOX_API_URL'],
    polling_freq = process.env['LENNOX_POLLING_FREQ'];


var request = require('request'),
    url = 'https://services.myicomfort.com/DBAcessService.svc/GetTStatInfoList?GatewaySN=' + gatewaysn + '&TempUnit=&Cancel_Away=-1',
    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

setInterval(function() {

   var json_get = {};
   var json_post = {};
   var date = new Date().toISOString();


   request(
       {
           url : url,
           headers : {
               "Authorization" : auth
           }
       },
       function (err, response, body) {

           if(err) console.log('database error', err);

           json_get = JSON.parse(body);
           json_post.Time = date;
           json_post.Away_Mode = json_get.tStatInfo[0].Away_Mode;
           json_post.ConnectionStatus = json_get.tStatInfo[0].ConnectionStatus;
           json_post.Cool_Set_Point = json_get.tStatInfo[0].Cool_Set_Point;
           json_post.Fan_Mode = json_get.tStatInfo[0].Fan_Mode;
           json_post.Heat_Set_Point = json_get.tStatInfo[0].Heat_Set_Point;
           json_post.Indoor_Humidity = json_get.tStatInfo[0].Indoor_Humidity;
           json_post.Indoor_Temp = json_get.tStatInfo[0].Indoor_Temp;
           json_post.Operation_Mode = json_get.tStatInfo[0].Operation_Mode;
           json_post.Program_Schedule_Mode = json_get.tStatInfo[0].Program_Schedule_Mode;
           json_post.Program_Schedule_Selection = json_get.tStatInfo[0].Program_Schedule_Selection;
           json_post.System_Status = json_get.tStatInfo[0].System_Status;

           console.log(json_post);

           request.post(api_url).form(json_post);

       }
   );
}, polling_freq);
