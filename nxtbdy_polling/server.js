var request = require('request');
var xml2js = require('xml2js');
var moment = require('moment')
var serverurl = 'http://11606333.ngrok.io/nxtbdy-consumer_war/update'
var busdata = []
var parser = new xml2js.Parser();

  var options = { method: 'POST',
    url: 'http://siri.nxtbus.act.gov.au:11000/C57DB8/vm/service.xml',
    headers:
     { 'postman-token': '481337fb-a242-e943-bc15-0835c9b3dee0',
       'cache-control': 'no-cache',
       'content-type': 'application/xml' },
    body: '<?xml version="1.0" encoding="iso-8859-1" standalone="yes"?>\n<Siri version="2.0" xmlns:ns2="http://www.ifopt.org.uk/acsb"\nxmlns="http://www.siri.org.uk/siri" xmlns:ns4="http://datex2.eu/schema/2_0RC1/2_0" xmlns:ns3="http://www.ifopt.org.uk/ifopt">\n<ServiceRequest>\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<RequestorRef>C57DB8</RequestorRef>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<VehicleMonitoringRef>VM_ACT_0900</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0902</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n <VehicleMonitoringRef>VM_ACT_0903</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<VehicleMonitoringRef>VM_ACT_0905</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0906</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<VehicleMonitoringRef>VM_ACT_0907</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n  <RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0910</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<VehicleMonitoringRef>VM_ACT_0003</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n  <RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0004</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n<VehicleMonitoringRef>VM_ACT_0005</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n  <RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0007</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n<VehicleMonitoringRequest version="2.0">\n<RequestTimestamp>2017-07-30T16:14:58+10:00</RequestTimestamp>\n  <VehicleMonitoringRef>VM_ACT_0314</VehicleMonitoringRef>\n</VehicleMonitoringRequest>\n</ServiceRequest>\n</Siri>' };

  function PollNXTBUS()
  {

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      var routeid,
          longitude,
          latitude,
          vehicle

      parser.parseString(body, function (err, result) {

          data = JSON.stringify(result.Siri.ServiceDelivery[0].VehicleMonitoringDelivery[0].VehicleActivity);
          data = JSON.parse(data);

          console.log('Number of entries: ' + data.length);

          for(var i = 0; i < data.length; i++) {
            if (data[i].MonitoredVehicleJourney[0].DirectionRef[0] === 'A')
            {
              if (data[i].MonitoredVehicleJourney[0].VehicleLocation != null && data[i].MonitoredVehicleJourney[0].VehicleRef !=null){
                routeid = data[i].MonitoredVehicleJourney[0].PublishedLineName[0]
                longitude = data[i].MonitoredVehicleJourney[0].VehicleLocation[0].Longitude[0]
                latitude = data[i].MonitoredVehicleJourney[0].VehicleLocation[0].Latitude[0]
                vehicle = data[i].MonitoredVehicleJourney[0].VehicleRef[0]
                busdata.push({vehicleid: vehicle, routeid: routeid, direction: 'A', longitude: longitude, latitude: latitude});
              }
            }
            if (data[i].MonitoredVehicleJourney[0].DirectionRef[0] === 'B')
            {
              if (data[i].MonitoredVehicleJourney[0].VehicleLocation != null && data[i].MonitoredVehicleJourney[0].VehicleRef !=null){
                routeid = data[i].MonitoredVehicleJourney[0].PublishedLineName[0]
                longitude = data[i].MonitoredVehicleJourney[0].VehicleLocation[0].Longitude[0]
                latitude = data[i].MonitoredVehicleJourney[0].VehicleLocation[0].Latitude[0]
                vehicle = data[i].MonitoredVehicleJourney[0].VehicleRef[0]
                busdata.push({vehicleid: vehicle, routeid: routeid, direction: 'B', longitude: longitude, latitude: latitude});
              }

            }
          }
          console.log(busdata)
          console.log(moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'));
          request({
              url: serverurl,
              method: 'POST',
              json: busdata
          })
      });
    });
  }

//poll NXTBUS every 30secs
setInterval(PollNXTBUS, 30000)
