
import Ticket, { ObjectId } from "./model";
import { success, fail, notFound } from "./../../services/response";
import Message from "../message/model";

// Create and Save a new record
export function create(req, res) {
  const data = req.body || {};
  const { userId, userType } = res.locals;

  // Validate request
  if (!(["arbitration", "support", "abuse"].includes(data.kind))) {
    return fail(res, 422, "subject must be either of arbitration, support, abuse");
  }
  if (!data.subject) {
    return fail(res, 422, "subject cannot be empty.");
  } else if (!(["product", "category", "brand", "vendor", "customer", "blog", "review", "order"].includes(data.subject))) {
    return fail(res, 422, "subject must be product, category, brand, vendor, customer, blog, review, order");
  }
  if (!data.messageBetween
    && ["customer_vendor", "customer_admin", "vendor_admin"].includes(data.messageBetween)
  ) {
    return fail(res, 422, "messageBetween must be visitor_vendor, customer_vendor, customer_admin, vendor_admin");
  }
  if (!data.complaint) return fail(res, 422, "complaint cannot be empty");

  const newObject = {};
  const newMessageObject = {};

  newObject.userType = userType;
  if (userType === "vendor") {
    newObject.vendor = userId;
    newMessageObject.vendor = userId;
  } else if (userType === "customer") {
    newObject.customer = userId;
    newMessageObject.customer = userId;
  } else {
    return fail(res, 422, `Only vendors or customers are allowed, not ${userType}`);
  }
  newMessageObject.sentBy = userType;
  switch (data.messageBetween) {
    case "customer_vendor": // check if the message is betwwen customer and vendor
      if (userType === "customer") { // if user is customer then reciever will be a vendor
        if (!data.vendor) return fail(res, 422, "vendor cannot be empty");
        newMessageObject.vendor = data.vendor;
      } else if (userType === "vendor") { // if user is vendor then reciever will be a customer
        if (!data.customer) return fail(res, 422, "customer cannot be empty");
        newMessageObject.customer = data.customer;
      }
      newObject.assignedDate = new Date();
      newMessageObject.messageBetween = data.messageBetween;
      break;
    default:
      return fail(res, 422, `Only vendors or customers are allowed, not ${userType}`);
  }

  newObject.subject = data.subject;
  newObject.subjectId = data.subjectId;
  newObject.complaint = data.complaint;
  if (data.vendor) newObject.vendor = data.vendor;
  if (data.customer) newObject.customer = data.customer;
  if (data.kind) newObject.kind = data.kind;
  if (data.amountDisputed) newObject.amountDisputed = data.amountDisputed;
  if (data.arbitrator) newObject.arbitrator = data.arbitrator;

  newMessageObject.kind = "ticket";
  newMessageObject.subject = `Issue with ${data.subject}`;
  newMessageObject.message = data.complaint;
  // Create a record
  const record = new Ticket(newObject);

  // Save Product in the database
  return record.save()
    .then((result) => {
      if (!result) return notFound(res, "Error: newly submitted record not found");
      newMessageObject.messageSession = result._id;
      const recordMessage = new Message(newMessageObject);
      return recordMessage.save()
        .then((resultMessage) => {
          if (!resultMessage) return notFound(res, "Error: newly submitted record not found");
          return success(res, 200, result, "New record has been created successfully!");
        })
        .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
    })
    .catch(err => fail(res, 500, `Error creating record.\r\n${err.message}`));
}

// Retrieve and return all records from the database.
export function findAll(req, res) {
  return Ticket.find()
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve and return all records from the database.
export function findUserickets(req, res) {
  const { userId, userType } = res.locals;
  let filter = {};
  if (userType === "vendor") {
    filter = { vendor: userId };
  } else if (userType === "customer") {
    filter = { customer: userId };
  }
  return Ticket.find(filter)
    .sort({ createdAt: 1 })
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .then(result => success(res, 200, result, "retrieving record(s) was successfully!"))
    .catch(err => fail(res, 500, `Error retrieving record(s).\r\n${err.message}`));
}

// Retrieve a single record with a given recordId
export function findOne(req, res) {
  const recordId = req.params.ticketId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Ticket.findById(recordId)
    .populate({ path: "review", select: "id subjectId comment rating", match: { standing: "active" } })
    .then((result) => {
      if (!result) return notFound(res, `Error: record not found with id ${recordId}.`);
      return success(res, 200, result, `retrieving record was successfully with id ${recordId}.`);
    }).catch((err) => {
      if (err.kind === "ObjectId") {
        notFound(res, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
      }
      return fail(res, 500, `Error retrieving record with id ${recordId}.\r\n${err.message}`);
    });
}

// Update record identified by the Id in the request
export function update(req, res) {
  const recordId = req.params.reviewId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  const newObject = {};

  if (userType === "vendor") {
    newObject.vendor = userId;
  } else if (userType === "customer") {
    newObject.customer = userId;
  } else {
    return fail(res, 422, `Only vendors or customers are allowed, not ${userType}`);
  }

  // Validate request
  if (!data.person) return fail(res, 422, "person id cannot be empty.");
  if (!ObjectId.isValid(data.personId)) return fail(res, 422, "Invalid person Id");
  if (!(["arbitration", "support", "abuse"].includes(data.kind))) {
    return fail(res, 422, "subject must be either of arbitration, support, abuse");
  }
  if (!data.subject) return fail(res, 422, "subject cannot be empty.");
  if (!data.complain) return fail(res, 422, "complain cannot be empty");

  newObject.person = data.person;
  newObject.personId = data.personId;
  newObject.subject = data.subject;
  newObject.complain = data.complain;
  if (data.vendor) newObject.vendor = data.vendor;
  if (data.customer) newObject.customer = data.customer;

  // Find record and update it with id
  return Ticket.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}

// Patch record identified by the Id in the request
export function modify(req, res) {
  const recordId = req.params.reviewId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  const data = req.body || {};
  const { userId, userType } = res.locals;
  const newObject = {};

  newObject.userType = userType;
  if (userType === "vendor") {
    newObject.vendor = userId;
  } else if (userType === "customer") {
    newObject.customer = userId;
  } else {
    return fail(res, 422, `Only vendors or customers are allowed, not ${userType}`);
  }

  // Validate request
  if (!data.person) return fail(res, 422, "person id cannot be empty.");
  if (!ObjectId.isValid(data.personId)) return fail(res, 422, "Invalid person Id");
  if (!(["arbitration", "support", "abuse"].includes(data.kind))) {
    return fail(res, 422, "subject must be either of arbitration, support, abuse");
  }
  if (!data.subject) return fail(res, 422, "subject cannot be empty.");
  if (!data.complain) return fail(res, 422, "complain cannot be empty");

  newObject.subject = data.subject;
  newObject.complain = data.complain;
  if (data.vendor) newObject.vendor = data.vendor;
  if (data.customer) newObject.customer = data.customer;

  // Find record and update it with id
  return Ticket.findByIdAndUpdate(recordId, newObject, { new: true })
    .then((result) => {
      if (!result) return notFound(res, `Error: newly submitted record not found with id ${recordId}`);
      return success(res, 200, result, "New record has been created successfully!");
    })
    .catch(err => fail(res, 500, `Error updating record with id ${recordId}.\r\n${err.message}`));
}


// Delete a ticket with the specified ticketId in the request
export async function destroy(req, res) {
  const recordId = req.params.ticketId || "";
  if (!recordId) return fail(res, 400, "No record Id as request parameter");
  if (!ObjectId.isValid(recordId)) return fail(res, 422, "Invalid record Id as request parameter");
  return Ticket.findByIdAndRemove(recordId)
    .then((record) => {
      if (!record) return notFound(res, `Record not found with id ${recordId}`);
      return success(res, 200, [], "Record deleted successfully!");
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return notFound(res, `Error: record not found with id ${recordId}\r\n${err.message}`);
      }
      return fail(res, 500, `Error: could not delete record with id ${recordId}\r\n${err.message}`);
    });
}

