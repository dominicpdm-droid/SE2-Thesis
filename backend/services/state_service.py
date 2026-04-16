from collections import deque

MAX_HISTORY = 10

class RoomState:
    def __init__(self):
        self.previous_centers = []
        self.feature_history = deque(maxlen=MAX_HISTORY)
        self.belief = {
            "Occupied": 0.1,
            "Leaving": 0.0,
            "Empty": 0.9
        }
        self.estimated_occupancy = 0
        self.current_state = "Empty"
        self.state_duration = 0.0

ROOM_STATES = {}

def get_room_state(room_id):
    if room_id not in ROOM_STATES:
        ROOM_STATES[room_id] = RoomState()
        ROOM_STATES[room_id].room_id = room_id 

    return ROOM_STATES[room_id]