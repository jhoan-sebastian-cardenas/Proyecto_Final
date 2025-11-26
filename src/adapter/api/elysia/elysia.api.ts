import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import { Controller } from "./controller.elysia";

import openapi from "@elysiajs/openapi";
import Elysia from "elysia";

export class ElysiaApiAdapter {
    private controller: Controller
    public app: Elysia

    constructor(
        computerService: ComputerService,
        deviceService: DeviceService,
        medicalDeviceService: MedicalDeviceService
    ) {
        this.controller = new Controller(
            computerService,
            deviceService,
            medicalDeviceService
        )

        // Create the main app instance
        const app = new Elysia();
        
        // Apply OpenAPI plugin
        const withOpenApi = app.use(openapi({}));
        
        // Register controller routes and use double assertion to avoid TS errors
        this.app = withOpenApi.use(this.controller.routes()) as unknown as Elysia;
    }

    async run() {
        const port = process.env.PORT || 3000;
        this.app.listen(port);
        
        console.log(`El servidor esta corriendo en el puerto http://localhost:${port}/openapi`);
    }
}