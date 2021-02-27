const climb = require('./climb.json')
const { Parser } = require('json2csv');
const fs = require('fs');

const fields = ['id','deleted','userId','name', 'documentCreatedOn',

  'eventCreatedOn','difficulty','type','version'];

const opts = { fields };

const parser = new Parser(opts);
const csv = parser.parse(climb.events.map(event => {
  const {createdOn: eventCreatedOn, ...rest}=event;

  const documentCreatedOn = new Date(1970, 0, 1);
  documentCreatedOn.setSeconds(climb.createdAt._seconds)

  return {
    documentCreatedOn: documentCreatedOn.toISOString(),
    id: climb.id,
    deleted: climb.deleted,
    userId: climb.userId,
    name: climb.name,
    eventCreatedOn,
    ...rest
  }
}))

fs.writeFileSync('./generated.csv', csv);
console.log('csv',csv)


