import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import { Controller } from "./controller.elysia";

import openapi from "@elysiajs/openapi";
import Elysia from "elysia";

export class ElysiaApiAdapter {
    private controller: Controller;
    public app: Elysia;

    constructor(
        computerService: ComputerService,
        deviceService: DeviceService,
        medicalDeviceService: MedicalDeviceService
    ) {
        this.controller = new Controller(
            computerService,
            deviceService,
            medicalDeviceService
        );

        // Crear instancia principal
        const app = new Elysia();

        // OpenAPI
        const withOpenApi = app.use(openapi({}));

        // Registrar rutas del controlador
        this.app = withOpenApi.use(this.controller.routes()) as unknown as Elysia;
    }

    async run() {
        // Puerto dinámico para Azure
        const port = Number(process.env.PORT) || 3000;

        this.app.listen({
            port,
            hostname: "0.0.0.0"
        });

        console.log(`🚀 Servidor en ejecución: Puerto http://localhost:${port}/openapi`);
    }
}
