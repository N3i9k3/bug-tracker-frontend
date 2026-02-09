import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import TicketCard from "./TicketCard";
import Comments from "./Comments";

const columns = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done"
};

export default function KanbanBoard({
  tickets,
  updateStatus,
  token,
  user,
  fetchTickets
}) {
  // ================= DRAG =================
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const ticketId = result.draggableId;
    const newStatus = result.destination.droppableId;

    updateStatus(ticketId, newStatus);
  };

  // ================= UI =================
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* 🔥 FIXED OUTER CONTAINER */}
      <div className="w-full p-3 md:p-4 overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {Object.entries(columns).map(([key, title]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-3 rounded-lg min-h-[300px] md:min-h-[500px] overflow-y-auto"
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
                            className="mb-3"
                          >
                            <TicketCard
                              ticket={ticket}
                              token={token}
                              user={user}
                              fetchTickets={fetchTickets}
                            />

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
      </div>
    </DragDropContext>
  );
}
