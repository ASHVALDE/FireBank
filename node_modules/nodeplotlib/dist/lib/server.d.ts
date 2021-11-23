import { IPlotsContainer } from './models';
export declare class Server {
    private instance;
    private plotsContainer;
    private port;
    private sockets;
    private nextSocketID;
    constructor(port: number);
    /**
     * Updates the plotdata, decides make the server listen again
     * and opens a new browser window targetting the webservers
     * data address.
     */
    spawn(plotsContainer: IPlotsContainer): void;
    /**
     * Closes the webserver, destroys all connected sockets
     * and clears the plots container.
     */
    clean(): void;
    /**
     * Opens the browser window using the opn-NPM module and
     * marks the container flag as pending. This means the website
     * does not have got its data yet.
     */
    private openBrowserWindow;
    private openWindow;
    /**
     * Creates the Webserver instance
     */
    private createServer;
    /**
     * Serves the plot data at /data/:id of the container[id].
     * It markes the container as opened and not pending anymore.
     * @param req
     * @param res
     * @returns {boolean} - Whether the request was served or not
     */
    private serveData;
    /**
     * Serves the website at http://localhost:PORT/plots/:id/index.html
     * @param req
     * @param res
     */
    private serveWebsite;
    /**
     * Closes the webserver if there are no more pending plots
     * and all plots were opened
     */
    private close;
}
