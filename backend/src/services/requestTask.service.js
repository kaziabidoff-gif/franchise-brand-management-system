const todoModel = require('../models/todo.model');

const SOURCE_TYPE = 'customization_request';

// Called whenever a request's assigned_to changes (including first assignment
// or clearing it). previousAssignedTo is the value before the change, or null.
const syncAssignment = async (request, previousAssignedTo) => {
  // Reassigned or unassigned - the old assignee no longer owns this work,
  // so their linked to-do (if any) should go away rather than linger.
  if (previousAssignedTo && previousAssignedTo !== request.assigned_to) {
    await todoModel.removeBySource(previousAssignedTo, SOURCE_TYPE, request.id);
  }

  if (!request.assigned_to) {
    return;
  }

  const title = `Design task: ${request.title}`;
  const existing = await todoModel.findBySource(request.assigned_to, SOURCE_TYPE, request.id);

  if (existing) {
    // Already linked (e.g. due date or priority changed on the request) -
    // update in place rather than creating a duplicate.
    await todoModel.update(existing.id, request.assigned_to, {
      title,
      priority: request.priority,
      due_date: request.due_date
    });
    return;
  }

  await todoModel.create(request.assigned_to, {
    title,
    priority: request.priority,
    due_date: request.due_date,
    source_type: SOURCE_TYPE,
    source_id: request.id
  });
};

// Request approved or rejected - the design work on it is concluded either way.
const resolveTask = async (request) => {
  if (!request.assigned_to) {
    return;
  }
  await todoModel.completeBySource(request.assigned_to, SOURCE_TYPE, request.id);
};

// Request cancelled/deleted outright - remove the linked to-do entirely.
const cancelTask = async (request) => {
  if (!request.assigned_to) {
    return;
  }
  await todoModel.removeBySource(request.assigned_to, SOURCE_TYPE, request.id);
};

module.exports = { syncAssignment, resolveTask, cancelTask, SOURCE_TYPE };
