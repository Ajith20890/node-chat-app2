var generateMessage = (from,text)=>{
  return {
  from,
  text,
  createdat:new Date().getTime()
};  
            };

module.exports={generateMessage};
