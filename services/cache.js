const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
//para que devuelva una promesa y no una callback
client.get = util.promisify(client.get);

//almacena una referencia a la funcion original, esta funcion se executa cada vez que una query es realizada
const exec = mongoose.Query.prototype.exec;

//agrega la nueva logica

mongoose.Query.prototype.exec = async function () {
  console.log("estoy por correr una query");
  //copio de forma segura las propiedades de una objeto a otro
  //el primer {}es el obejto al que vamos a copiar las propiedades de this.getQuery y las de la collection
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name })
  );
  //vemos si tenemos un key en reis
  const cacheValue = await client.get(key);
  //si esta devolvemos eso
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
  }
  //hacemos la query i la almacenamos en redis

  const result = await exec.apply(this, arguments);
  client.set(key, JSON.stringify(result));
  return result;
};
