import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import Comments from "./Comments"; // ⭐ Step 1

const columns = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done"
};

export default function KanbanBoard({ tickets, updateStatus, token }) { // ⭐ Step 2
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const ticketId = result.draggableId;
    const newStatus = result.destination.droppableId;

    updateStatus(ticketId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(columns).map(([key, title]) => (
          <Droppable droppableId={key} key={key}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-lg min-h-[400px]"
              >
                <h2 className="font-bold mb-3">{title}</h2>

                {tickets
                  .filter((t) => (t.status || "todo") === key)
                  .map((ticket, index) => (
                    <Draggable
                      key={ticket._id}
                      draggableId={ticket._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 mb-2 rounded shadow"
                        >
                          <p className="font-medium">{ticket.title}</p>
                          <p className="text-xs mb-2">{ticket.priority}</p>

                          {/* ⭐ Step 3 — COMMENTS */}
                          <Comments
                            ticketId={ticket._id}
                            token={token}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
