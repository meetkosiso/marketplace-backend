/**
* @property {String} userId is the user's id
* @property {String} userType is either admin|vendor|customer|visitor
* @property {String} accessId is the record's primary key
* @property {Date} accessDate is the request object timestamp
* @property {Date} createdAt is the date the record is created
*/

import { instance, databaseId, db } from "../../services/database";
import { generateId } from "./../../services/helpers";


// template to construct input
export const accessObject = {
  userId: `${generateId()}`,
  accessId: null,
  userType: null,
  ipAddress: null,
  accessDate: null,
  createdAt: "spanner.commit_timestamp()",
};

// sample to initialize table
export const sample = {
  userId: "f9e0dad3-1977-4a71-9ea4-80387eb9ad43",
  accessId: `${generateId()}`,
  userType: "admin",
  ipAddress: "190.168.5.3",
  accessDate: "2018-09-29T00:54:38.589Z",
  createdAt: "spanner.commit_timestamp()",
};

// //////////////////////////////////////////////////////////
//            spanner_find_user_access
// //////////////////////////////////////////////////////////

/**
 * @description findAccess returns array of access records
 * @param {*} userType admin, vendor, customer, visitor
 * @param {*} userId array of userIds.
 * @param {Object} filter pagination, size, dateFloor, offset
 * pagination = true | false
 * size = some, all records of a category
 * dateFloor = filter by when record was createdAt
 * offset = records to skip
 */
export async function findAccess(userType, userId, filter) {
  // [START spanner_find_user_access]
  // const byDefault = { pagination: false, size: "all", dateFloor: "", limit: 100, offset: 0 };

  const { pagination, size, dateFloor, limit, offset } = filter;

  const database = instance.database(databaseId);

  const users = ["admin", "vendor", "customer", "visitor", "anonymous"];

  let mySql = "SELECT *, accessId As id FROM Access@{FORCE_INDEX=AccessByUserType} As t WHERE true ";
  const myParams = {};

  if (size === "some") {
    mySql = "SELECT *, accessId As id FROM Access@{FORCE_INDEX=AccessByUserId} As t WHERE true ";
  }

  if (Date.parse(dateFloor) !== NaN) { // eslint-disable-line use-isnan
    mySql += " AND t.createdAt>@dateFloor  ";
    myParams.dateFloor = dateFloor;
  }
  if (users.includes(userType)) {
    mySql += " AND t.userType=@userType ";
    myParams.userType = userType;
  }
  if (typeof userId === "object" && size === "some") {
    mySql += " AND t.userId IN UNNEST(@userId) ";
    myParams.userId = userId;
  }
  mySql += " ORDER BY t.createdAt ";

  if (pagination && typeof limit === "number") {
    mySql += " LIMIT @limit ";
    myParams.limit = limit;
  }
  if (pagination && typeof offset === "number") {
    mySql += " OFFSET @offset ";
    myParams.offset = offset;
  }

  const query = { sql: mySql, params: myParams };

  const result = [];

  try {
    const results = await database.run(query);
    const rows = results[0];
    rows.forEach((row) => {
      const json = row.toJSON();
      result.push(json);
    });
    database.close();
  } catch (err) {
    throw err;
  }
  return result;
  // [END spanner_find_user_access]
}

// //////////////////////////////////////////////////////////
//            spanner_create_access_table
// //////////////////////////////////////////////////////////

export function createAccess() {
  // [START spanner_create_access_table]
  const database = instance.database(databaseId);
  return new Promise((resolve, reject) => {
    const Schema =
      `CREATE TABLE Access (
        userId  STRING(36) NOT NULL,
        accessId  STRING(36) NOT NULL,
        userType STRING(10) NOT NULL,
        ipAddress STRING(1000) NOT NULL,
        accessDate  TIMESTAMP  NOT NULL,
        createdAt TIMESTAMP OPTIONS (allow_commit_timestamp=true)
        ) PRIMARY KEY (accessId)`;

    return database.createTable(Schema)
      .then((data) => {
        const table = data[0];
        const operation = data[1];

        console.log(`Waiting for operation on ${table.name} table to complete...`);
        return operation.promise();
      })
      .then(() => resolve(`Created table on instance ${database.id}.`))
      .catch(err => reject(err));
  });
  // [END spanner_create_access_table]
}


export function createAccessByUserType() {
  // [START spanner_create_access_by_usertype_index]
  return new Promise((resolve, reject) =>
    db.createIndex("CREATE INDEX AccessByUserType ON Access(accessId, userType, createdAt DESC)")
      .then((result) => { resolve(result); })
      .catch(err => reject(err)));
  // [END spanner_create_access_by_usertype_index]
}


export function createAccessByUserId() {
  // [START spanner_create_access_by_userid_index]
  return new Promise((resolve, reject) =>
    db.createIndex("CREATE INDEX AccessByUserId ON Access(accessId, userId, createdAt DESC)")
      .then((result) => { resolve(result); })
      .catch(err => reject(err)));
  // [END spanner_create_access_by_userid_index]
}
