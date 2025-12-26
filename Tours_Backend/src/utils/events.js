import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

export const EVENTS = {
    TOUR_STATUS_UPDATED: 'TOUR_STATUS_UPDATED',
    GUIDE_STATUS_UPDATED: 'GUIDE_STATUS_UPDATED',
    DELETION_REQUEST_CREATED: 'DELETION_REQUEST_CREATED',
    DELETION_REQUEST_PROCESSED: 'DELETION_REQUEST_PROCESSED',
};

// Log all events for debugging (will be swapped with Kafka producer later)
Object.values(EVENTS).forEach(eventName => {
    eventEmitter.on(eventName, (data) => {
        console.log(`[EVENT] ${eventName}:`, JSON.stringify(data, null, 2));
    });
});

export default eventEmitter;
