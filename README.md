# blog-node-advance

NESTED HASHES, cada key apunta a un objeto anidado (value = nested ley | nested value) , no a un valor especifico.
para acceder a estos valores se usa HSET y HGET

promisify. toma cualquier funcion que tenga una callback como ultimo parametro y lo hace devolver una promesas.
lo usamos para que la devolucion de la llamada sea una promesa y no un CB

client.flushall() - redis..borra todo

se modifica el objeto query de mongoose para chequear antes de ejecutar la query(exec) si la consulta ya ha sido hecha.
sobreescribir la funcion exec para chequear si la consulta ya ha sido hecha.

VAMOS sobre escribir la funcion (exec)de mongoose
