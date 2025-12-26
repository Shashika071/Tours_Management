import initializeGuideSubscriber from './guideSubscriber.js';

/**
 * Initialize all subscribers
 */
export const initSubscribers = () => {
    initializeGuideSubscriber();
    console.log('Event subscribers initialized');
};
