import { ComputerService, DeviceService, MedicalDeviceService } from "@/core/service";
import Elysia from "elysia";
import { CRITERIA_QUERY_PARAMS_SCHEMA, CriteriaHelper, CriteriaQueryParams } from "./criteria.helper";
import { COMPUTER_REQUEST_SCHEMA, ComputerRequest, MED_DEVICE_REQUEST_SCHEMA, MedDeviceRequest } from "@/core/dto";
import z from "zod";
import { Computer, EnteredDevice, FrequentComputer, MedicalDevice } from "@/core/domain";
import { LoggingService } from "@/core/service/logging.service";

export class Controller {
    private loggingService: LoggingService;

    constructor(
        private computerService: ComputerService,
        private deviceService: DeviceService,
        private medicalDeviceService: MedicalDeviceService
    ) {
        this.loggingService = LoggingService.getInstance();
        console.log('Controller initialized with logging service');
    }

    public routes() {
        return new Elysia({
            prefix: "/api"
        })
            .guard({
                query: CRITERIA_QUERY_PARAMS_SCHEMA
            })
            .post(
                "/computers/checkin",
                async ({ body, request }) => {
                    console.log('Handling /computers/checkin request');
                    const startTime = Date.now();
                    try {
                        const result = await this.checkinComputer(body);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/computers/checkin' });
                        throw error;
                    }
                },
                {
                    type: "multipart/form-data",
                    body: COMPUTER_REQUEST_SCHEMA
                }
            )
            .post(
                "/medicaldevices/checkin",
                async ({ body, request }) => {
                    console.log('Handling /medicaldevices/checkin request');
                    const startTime = Date.now();
                    try {
                        const result = await this.checkinMedicalDevice(body);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/medicaldevices/checkin' });
                        throw error;
                    }
                },
                {
                    type: "multipart/form-data",
                    body: MED_DEVICE_REQUEST_SCHEMA
                }
            )
            .post(
                "/computers/frequent",
                async ({ body, request }) => {
                    console.log('Handling /computers/frequent request');
                    const startTime = Date.now();
                    try {
                        const result = await this.registerFrequentComputer(body);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/computers/frequent' });
                        throw error;
                    }
                },
                {
                    type: "multipart/form-data",
                    body: COMPUTER_REQUEST_SCHEMA
                }
            )
            .get(
                "/computers",
                async ({ query, request }) => {
                    console.log('Handling /computers GET request');
                    const startTime = Date.now();
                    try {
                        const result = await this.getComputers(query);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/computers' });
                        throw error;
                    }
                }
            )
            .get(
                "/medicaldevices",
                async ({ query, request }) => {
                    console.log('Handling /medicaldevices GET request');
                    const startTime = Date.now();
                    try {
                        const result = await this.getMedicalDevices(query);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/medicaldevices' });
                        throw error;
                    }
                }
            )
            .get(
                "/computers/frequent",
                async ({ query, request }) => {
                    console.log('Handling /computers/frequent GET request');
                    const startTime = Date.now();
                    try {
                        const result = await this.getFrequentComputers(query);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/computers/frequent' });
                        throw error;
                    }
                }
            )
            .get(
                "/devices/entered",
                async ({ query, request }) => {
                    console.log('Handling /devices/entered GET request');
                    const startTime = Date.now();
                    try {
                        const result = await this.getEnteredDevices(query);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/devices/entered' });
                        throw error;
                    }
                }
            )
            .guard({
                params: z.object({
                    id: z.uuid()
                })
            })
            .patch(
                "/computers/frequent/checkin/:id",
                async ({ params: { id }, request }) => {
                    console.log('Handling /computers/frequent/checkin/:id PATCH request');
                    const startTime = Date.now();
                    try {
                        const result = await this.checkinFrequentComputer(id);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/computers/frequent/checkin/:id', id });
                        throw error;
                    }
                }
            )
            .patch(
                "/devices/checkout/:id",
                async ({ params: { id }, request }) => {
                    console.log('Handling /devices/checkout/:id PATCH request');
                    const startTime = Date.now();
                    try {
                        const result = await this.checkoutDevice(id);
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 200, duration);
                        return result;
                    } catch (error) {
                        const duration = Date.now() - startTime;
                        await this.loggingService.logRequest(request.method, request.url, 500, duration);
                        await this.loggingService.logError(error as Error, { endpoint: '/devices/checkout/:id', id });
                        throw error;
                    }
                }
            )
    }

    async checkinComputer(request: ComputerRequest): Promise<Computer> {
        return this.computerService.checkinComputer(request)
    }

    async checkinFrequentComputer(id: string): Promise<FrequentComputer> {
        return this.computerService.checkinFrequentComputer(id)
    }

    async checkinMedicalDevice(request: MedDeviceRequest): Promise<MedicalDevice> {
        return this.medicalDeviceService.checkinMedicalDevice(request)
    }

    async registerFrequentComputer(request: ComputerRequest): Promise<FrequentComputer> {
        return this.computerService.registerFrequentComputer(request)
    }

    async getComputers(queryParams: CriteriaQueryParams): Promise<Computer[]> {
        const criteria = CriteriaHelper.parseFromQuery(queryParams)

        return this.computerService.getComputers(criteria)
    }

    async getMedicalDevices(queryParams: CriteriaQueryParams): Promise<MedicalDevice[]> {
        const criteria = CriteriaHelper.parseFromQuery(queryParams)

        return this.medicalDeviceService.getMedicalDevices(criteria)
    }

    async getFrequentComputers(queryParams: CriteriaQueryParams): Promise<FrequentComputer[]> {
        const criteria = CriteriaHelper.parseFromQuery(queryParams)

        return this.computerService.getFrequentComputers(criteria)
    }

    async getEnteredDevices(queryParams: CriteriaQueryParams): Promise<EnteredDevice[]> {
        const criteria = CriteriaHelper.parseFromQuery(queryParams)

        return this.deviceService.getEnteredDevices(criteria)
    }

    async checkoutDevice(id: string): Promise<void> {
        return this.deviceService.checkoutDevice(id)
    }
}