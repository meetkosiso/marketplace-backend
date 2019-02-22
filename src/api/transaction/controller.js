
import Transaction, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import { hasProp, dateDaysAgo } from "./../../services/helpers";
// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;
  const newObject = {};

  switch (userType) {
    case "admin": newObject.admin = userId; newObject.subject = "admin";
      break;
    case "vendor": newObject.vendor = userId; newObject.subject = "vendor";
      break;
    case "customer": newObject.customer = userId; newObject.subject = "customer";
      break;
    default: return fail(res, 422, `Operation not allowed for unknown userType ${userType}`);
  }

  // Validate request
  if (!hasProp(data, "transactionHash")) return fail(res, 422, "transactionHash cannot be empty");

  if (hasProp(data, "code")) newObject.code = data.code;
  if (hasProp(data, "value")) newObject.value = data.value;
  if (hasProp(data, "gas")) newObject.gas = data.gas;
  if (hasProp(data, "currency")) newObject.currency = data.currency;
  if (hasProp(data, "description")) newObject.description = data.description;
  if (hasProp(data, "transactionHash")) newObject.transactionHash = data.transactionHash;

  // Create a record
  const record = new Transaction(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}


// Retrieve and return all records from the database.
export function findAll(req, res) {
  // customer and vendor gets only their records
  // admin can get any record specify by query: userType, userId, datefrom-dateTo, since
  const userType = req.query.userType || ""; // admin, vendor, customer, visitor
  const userId = req.query.userId || []; // Array of userIds
  const since = Number(req.query.since) || 0; // only docs from the past 0 days
  const dateFloor = dateDaysAgo(since);

  const filter = {};
  if (ObjectId.isValid(userId)) filter[userType] = userId;
  if (since > 0) filter.createdAt = dateFloor;

  return Transaction.find(filter)
    .populate({ path: "admin", select: "id fullname phone" })
    .populate({ path: "vendor", select: "id fullname phone" })
    .populate({ path: "customer", select: "id fullname phone" })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.transactionId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Transaction.findById(recordId)
    .populate({ path: "admin", select: "id fullname phone" })
    .populate({ path: "vendor", select: "id fullname phone" })
    .populate({ path: "customer", select: "id fullname phone" })
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${recordId}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${recordId}.`);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
    });
}
