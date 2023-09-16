const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys");

const client = redis.createClient(keys.redisUrl);
//para que devuelva una promesa y no una callback
client.hget = util.promisify(client.hget);

//almacena una referencia a la funcion original, esta funcion se executa cada vez que una query es realizada
const exec = mongoose.Query.prototype.exec;

//creo una nueva funcion cache..para elegir que llamado quiero que sea cacheada y cual no
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "default");

  return this;
};

//agrega la nueva logica

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  //copio de forma segura las propiedades de una objeto a otro
  //el primer {}es el obejto al que vamos a copiar las propiedades de this.getQuery y las de la collection
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name })
  );
  //vemos si tenemos un key en reis
  const cacheValue = await client.hget(this.hashKey, key);
  //si esta devolvemos eso
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
  }
  //hacemos la query i la almacenamos en redis

  const result = await exec.apply(this, arguments);
  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);
  return result;
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
