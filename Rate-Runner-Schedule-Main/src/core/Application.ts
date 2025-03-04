import * as http from "http";
import _ from "lodash";
import * as os from "os";
import express, {Express} from "express";
import {
    IocAdapter,
    RoutingControllersOptions,
    useContainer,
    UseContainerOptions,
    useExpressServer
} from "routing-controllers";

import { AuthorizationChecker } from "routing-controllers/types/AuthorizationChecker"
import { CurrentUserChecker } from "routing-controllers/types/CurrentUserChecker"

export class Application {
    private readonly controllers: Function[] | string[] = [];
    private readonly middlewares: Function[] | string[] = [];

    protected express: Express;
    protected server: http.Server;

    protected authorizationChecker?: AuthorizationChecker;
    protected currentUserChecker?: CurrentUserChecker;
    readonly arguments: any;

    constructor(protected readonly options: RoutingControllersOptions = {}) {

        process.on("SIGINT", async () => {
            await this.internalOnProcessInterrupt();
        });

        process.on("SIGTERM", async () => {
            await this.internalOnProcessTerminate();
        });

        const startMethod = this.start;
        this.start = async (...param: any[]) => {
            await this.beforeApplicationStart.bind(this).call(this);
            await startMethod.bind(this).call(this, ...param);
            await this.onApplicationStarted.bind(this).call(this);
        };

        this.express = express();
    }

    public async beforeApplicationStart() { }
    public async onApplicationStarted() { }
    public async onProcessTerminate() { }
    public async onProcessInterrupt() { }

    private async internalOnProcessTerminate() {
        await this.onProcessTerminate();
        process.exit(0);
    }

    private async internalOnProcessInterrupt() {
        await this.onProcessInterrupt();
        process.exit(0);
    }

    public useContainer(iocAdapter: IocAdapter, options?: UseContainerOptions) {
        useContainer(iocAdapter, options);
        return this;
    }

    public useMiddleware<T extends string | Function>(middleware: T) {
        (this.middlewares as T[]).push(middleware);
        return this;
    }

    public useController<T extends string | Function>(controller: T) {
        (this.controllers as T[]).push(controller);
        return this;
    }

    public useAuthorizationChecker(fn: AuthorizationChecker) {
        this.authorizationChecker = fn;
        return this;
    }

    public useCurrentUserChecker(fn: CurrentUserChecker) {
        this.currentUserChecker = fn;
        return this;
    }

    public async start(port: number) {
        useExpressServer(
            this.express,
            {
                validation: {
                    validationError: {
                        target: false
                    }
                },
                ...this.options,
                controllers: this.controllers,
                middlewares: this.middlewares,
                authorizationChecker: this.authorizationChecker,
                currentUserChecker: this.currentUserChecker
            }
        );

        const interfaces = _(os.networkInterfaces())
            .reduce((prev, curr) => [...prev, ...curr])
            .filter((iface) => iface.family === "IPv4");

        this.server = http.createServer(this.express);

        await new Promise<void>((resolve, reject) => {
            this.server.once("error", (error) => {
                reject(error);
            });

            this.server.listen(port, () => {
                console.log(`HTTP server started at port ${port}, you can access from\n` +
                    _(interfaces).map((iface) => `- http://${iface.address}:${port}/`).join("\n"));

                resolve();
            });
        });
    }

}
