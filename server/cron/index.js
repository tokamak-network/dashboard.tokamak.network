const cron = require('node-cron');
const ncp = require('ncp').ncp;
const source = `${__dirname}/../../db`;
const destination = `${__dirname}/../../dump`;

cron.schedule('* 0,6,12,18 * * *', () => {
  dump();
});

const dump = function () {
  ncp(source, destination, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('done!');
  });
};
