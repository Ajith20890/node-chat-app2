var moment = require('moment');

var generateMessage = (from,text)=>{
  return {
  from,
  text,
  createdat:moment().valueOf()
};
            };

var generateLocationMessage=(from,latitude,longitude)=>{
  return{
    from,
    url:`http://www.google.com/maps?q=${latitude},${longitude}`,
    createdat:moment().valueOf()
  };
};

module.exports={generateMessage,generateLocationMessage};
