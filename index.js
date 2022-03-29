const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const options = { memory: "2GB", timeoutSeconds: 300 };


const sendNotification = (async () => {

  var nowDate = new Date();
  nowDate.setHours(nowDate.getHours() + 1);
  var dayNumber =  nowDate.getDay(); 
  var monthNumber = nowDate.getMonth();

  const citiesRef = db.collection('prayer');
  const snapshot = await citiesRef.get();
  snapshot.forEach(doc => {

    // Find Month
    if (doc.data().month == monthNumber.toString()) {

      // String time value day of prayer 
      var Asr = doc.data().prayer[dayNumber].Asr.adan
      var Duhur = doc.data().prayer[dayNumber].Duhur.adan
      var Fajr = doc.data().prayer[dayNumber].Fajr.adan
      var Isha = doc.data().prayer[dayNumber].Isha.adan
      var Maghrib = doc.data().prayer[dayNumber].Maghrib.adan

      var asrDate = new Date();
      asrDate.setHours(Asr.split(":")[0], Asr.split(":")[1], 0);

      var duhurDate = new Date();
      duhurDate.setHours(Duhur.split(":")[0], Duhur.split(":")[1], 0);

      var fajrDate = new Date();
      fajrDate.setHours(Fajr.split(":")[0], Fajr.split(":")[1], 0);

      var ishaDate = new Date();
      ishaDate.setHours(Isha.split(":")[0], Isha.split(":")[1], 0);

      var maghribDate = new Date();
      maghribDate.setHours(Maghrib.split(":")[0], Maghrib.split(":")[1], 0);

      console.log(doc.id, '=>', doc.data().prayer[0].Asr.adan);
      console.log(
        "Asr: :  " + asrDate,
        "Duhur: :  " + duhurDate,
        "Fajr: :  " + fajrDate,
        "Isha: :  " + ishaDate,
        "Maghrib: :  " + maghribDate,
        "nowDate: :  " + nowDate,
        "dayNumber: :  " + dayNumber,
        "monthNumber: :  " + monthNumber,
      );

      // Calculate notification can show 
      var asrDiff = (asrDate - nowDate) / 1000;
      var duhurDiff = (duhurDate - nowDate) / 1000;
      var fajrDiff = (fajrDate - nowDate) / 1000;
      var ishaDiff = (ishaDate - nowDate) / 1000;
      var maghribDiff = (maghribDate - nowDate) / 1000;

      if (asrDiff > 0 && asrDiff < 360) {

        const payLoad = {
          notification: {
            title: "Asr Pray Time",
            body: "May Allah accept your prays InshAllah",
            sound: "default",
          },
        };
      
        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 2,
        };

        admin.messaging().sendToTopic("asrTopic", payLoad, options);
        
      } else if (duhurDiff > 0 && duhurDiff < 360) {

        const payLoad = {
          notification: {
            title: "Duhur Pray Time",
            body: "May Allah accept your prays InshAllah",
            sound: "default",
          },
        };
      
        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 2,
        };

        admin.messaging().sendToTopic("duhurTopic", payLoad, options);
      } else if (fajrDiff > 0 && fajrDiff < 360) {

        const payLoad = {
          notification: {
            title: "Fajr Pray Time",
            body: "May Allah accept your prays InshAllah",
            sound: "default",
          },
        };
      
        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 2,
        };

        admin.messaging().sendToTopic("fajrTopic", payLoad, options);
      } else if (ishaDiff > 0 && ishaDiff < 360) {

        const payLoad = {
          notification: {
            title: "Isha Pray Time",
            body: "May Allah accept your prays InshAllah",
            sound: "default",
          },
        };
      
        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 2,
        };

        admin.messaging().sendToTopic("ishaTopic", payLoad, options);
      } else if (maghribDiff > 0 && maghribDiff < 360) {

        const payLoad = {
          notification: {
            title: "Magrib Pray Time",
            body: "May Allah accept your prays InshAllah",
            sound: "default",
          },
        };
      
        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 2,
        };

        admin.messaging().sendToTopic("maghribTopic", payLoad, options);
      }

      console.log(
        "asrDiff: :  " + asrDiff,
        "duhurDiff: :  " + duhurDiff,
        "fajrDiff: :  " + fajrDiff,
        "ishaDiff: :  " + ishaDiff,
        "maghribDiff: :  " + maghribDiff,
      );
    }
  });

})

// eslint-disable-next-line max-len
exports.californication = functions.runWith(options).pubsub.schedule("every 5 minutes").onRun((context) => {
  sendNotification()
  return null;

});

